import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  increment,
  arrayUnion,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SchoolSettings, MadingPost, StudentGraduation, Comment, StaffAccount } from '../types';
import { initialSchoolSettings, initialMadingPosts, initialGraduationStudents } from '../data/initialData';
import { initialStaffAccounts } from '../data/roleAccounts';

const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'school_settings';
const SYSTEM_METADATA_COLLECTION = 'system_metadata';
const SYSTEM_INIT_DOC_ID = 'initialization';
const MADING_COLLECTION = 'mading_posts';
const STUDENTS_COLLECTION = 'students';
const STAFF_COLLECTION = 'staff_accounts';

/**
 * Recursively removes undefined values from objects to prevent Firestore setDoc/updateDoc errors
 */
function cleanForFirestore<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanForFirestore) as unknown as T;
  }
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = cleanForFirestore(value);
    }
  }
  return cleaned as T;
}

/**
 * Automatically seeds default data to Firestore ONLY on first-time setup.
 * Once initialized, it will NEVER re-seed deleted mading posts, students, or accounts on refresh.
 */
export async function initializeFirestoreDataIfEmpty(): Promise<void> {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore init check timeout')), 4000)
    );

    await Promise.race([
      (async () => {
        // 0. Check system initialization marker
        const initDocRef = doc(db, SYSTEM_METADATA_COLLECTION, SYSTEM_INIT_DOC_ID);
        const initSnap = await getDoc(initDocRef);

        const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
        const settingsSnap = await getDoc(settingsDocRef);

        // If system is already initialized or settings document already exists, DO NOT re-seed!
        if (initSnap.exists() || settingsSnap.exists()) {
          if (!initSnap.exists()) {
            await setDoc(initDocRef, { isInitialized: true, initializedAt: new Date().toISOString() });
          }
          return;
        }

        console.log('Performing first-time seeding to Cloud Firestore...');

        // 1. Initial settings
        await setDoc(settingsDocRef, initialSchoolSettings);

        // 2. Initial mading posts
        const madingBatch = writeBatch(db);
        initialMadingPosts.forEach((post) => {
          const postRef = doc(db, MADING_COLLECTION, post.id);
          madingBatch.set(postRef, post);
        });
        await madingBatch.commit();

        // 3. Initial graduation students
        const studentsBatch = writeBatch(db);
        initialGraduationStudents.forEach((student) => {
          const studentRef = doc(db, STUDENTS_COLLECTION, student.id);
          studentsBatch.set(studentRef, student);
        });
        await studentsBatch.commit();

        // 4. Initial staff (Guru & Admin)
        const staffBatch = writeBatch(db);
        initialStaffAccounts.forEach((staff) => {
          const staffRef = doc(db, STAFF_COLLECTION, staff.id);
          staffBatch.set(staffRef, staff);
        });
        await staffBatch.commit();

        // 5. Save initialization flag so future refreshes never re-insert deleted posts
        await setDoc(initDocRef, { isInitialized: true, initializedAt: new Date().toISOString() });
        console.log('First-time Cloud Firestore seeding completed successfully.');
      })(),
      timeoutPromise,
    ]);
  } catch (error) {
    console.info('Firestore initial sync in offline/cached mode:', (error as Error)?.message || error);
  }
}

/**
 * Subscribe to School Settings in real-time
 */
export function subscribeSchoolSettings(
  onUpdate: (settings: SchoolSettings) => void,
  onError?: (err: Error) => void
) {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as SchoolSettings);
      } else {
        // If not exist, seed and fallback to initial
        setDoc(docRef, initialSchoolSettings).catch(console.error);
        onUpdate(initialSchoolSettings);
      }
    },
    (error) => {
      // Quietly log snapshot status (e.g. temporary offline mode)
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.info('Firestore settings snapshot operating in offline/cached mode');
      } else {
        console.warn('Settings snapshot notice:', error.message);
      }
      if (onError) onError(error);
    }
  );
}

/**
 * Save School Settings to Firestore
 */
export async function saveSchoolSettingsToFirestore(settings: SchoolSettings): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  await setDoc(docRef, cleanForFirestore(settings), { merge: true });
}

/**
 * Subscribe to Mading Posts in real-time
 */
export function subscribeMadingPosts(
  onUpdate: (posts: MadingPost[]) => void,
  onError?: (err: Error) => void
) {
  const collRef = collection(db, MADING_COLLECTION);
  return onSnapshot(
    collRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const loadedPosts: MadingPost[] = [];
      snapshot.forEach((d) => {
        loadedPosts.push(d.data() as MadingPost);
      });
      // Sort pinned first, then by id descending (newest)
      loadedPosts.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return (b.id || '').localeCompare(a.id || '');
      });
      onUpdate(loadedPosts);
    },
    (error) => {
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.info('Firestore mading snapshot operating in offline/cached mode');
      } else {
        console.warn('Mading posts snapshot notice:', error.message);
      }
      if (onError) onError(error);
    }
  );
}

/**
 * Add or Update a Mading Post
 */
export async function saveMadingPostToFirestore(post: MadingPost): Promise<void> {
  const postRef = doc(db, MADING_COLLECTION, post.id);
  await setDoc(postRef, cleanForFirestore(post), { merge: true });
}

/**
 * Delete a Mading Post
 */
export async function deleteMadingPostFromFirestore(postId: string): Promise<void> {
  const postRef = doc(db, MADING_COLLECTION, postId);
  await deleteDoc(postRef);
}

/**
 * Like a Mading Post (Atomic Firestore Increment)
 */
export async function likeMadingPostInFirestore(postId: string): Promise<void> {
  const postRef = doc(db, MADING_COLLECTION, postId);
  await updateDoc(postRef, {
    likes: increment(1),
  });
}

/**
 * Add a Comment to Mading Post (Atomic Firestore Array Union)
 */
export async function addCommentToMadingPostInFirestore(
  postId: string,
  comment: Comment
): Promise<void> {
  const postRef = doc(db, MADING_COLLECTION, postId);
  await updateDoc(postRef, {
    comments: arrayUnion(comment),
  });
}

/**
 * Subscribe to Students in real-time
 */
export function subscribeStudents(
  onUpdate: (students: StudentGraduation[]) => void,
  onError?: (err: Error) => void
) {
  const collRef = collection(db, STUDENTS_COLLECTION);
  return onSnapshot(
    collRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const loadedStudents: StudentGraduation[] = [];
      snapshot.forEach((d) => {
        loadedStudents.push(d.data() as StudentGraduation);
      });
      // Sort by class_name, then full_name
      loadedStudents.sort((a, b) => {
        const classComp = a.class_name.localeCompare(b.class_name);
        if (classComp !== 0) return classComp;
        return a.full_name.localeCompare(b.full_name);
      });
      onUpdate(loadedStudents);
    },
    (error) => {
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.info('Firestore students snapshot operating in offline/cached mode');
      } else {
        console.warn('Students snapshot notice:', error.message);
      }
      if (onError) onError(error);
    }
  );
}

/**
 * Save or Update a single Student
 */
export async function saveStudentToFirestore(student: StudentGraduation): Promise<void> {
  const studentRef = doc(db, STUDENTS_COLLECTION, student.id);
  await setDoc(studentRef, cleanForFirestore(student), { merge: true });
}

/**
 * Delete a single Student
 */
export async function deleteStudentFromFirestore(studentId: string): Promise<void> {
  const studentRef = doc(db, STUDENTS_COLLECTION, studentId);
  await deleteDoc(studentRef);
}

/**
 * Batch Import Students
 */
export async function batchImportStudentsToFirestore(
  studentsList: StudentGraduation[]
): Promise<void> {
  const batch = writeBatch(db);
  studentsList.forEach((student) => {
    const studentRef = doc(db, STUDENTS_COLLECTION, student.id);
    batch.set(studentRef, cleanForFirestore(student), { merge: true });
  });
  await batch.commit();
}

/**
 * Subscribe to Staff Accounts (Guru & Admin) in real-time
 */
export function subscribeStaffAccounts(
  onUpdate: (staff: StaffAccount[]) => void,
  onError?: (err: Error) => void
) {
  const collRef = collection(db, STAFF_COLLECTION);
  return onSnapshot(
    collRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const loadedStaff: StaffAccount[] = [];
      snapshot.forEach((d) => {
        loadedStaff.push(d.data() as StaffAccount);
      });
      // Sort: Admin first, then Gurus
      loadedStaff.sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return a.name.localeCompare(b.name);
      });
      onUpdate(loadedStaff);
    },
    (error) => {
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.info('Firestore staff snapshot operating in offline/cached mode');
      } else {
        console.warn('Staff snapshot notice:', error.message);
      }
      if (onError) onError(error);
    }
  );
}

/**
 * Save or Update a Staff Account (Guru / Admin)
 */
export async function saveStaffAccountToFirestore(staff: StaffAccount): Promise<void> {
  const staffRef = doc(db, STAFF_COLLECTION, staff.id);
  await setDoc(staffRef, cleanForFirestore(staff), { merge: true });
}

/**
 * Delete a Staff Account
 */
export async function deleteStaffAccountFromFirestore(staffId: string): Promise<void> {
  const staffRef = doc(db, STAFF_COLLECTION, staffId);
  await deleteDoc(staffRef);
}

/**
 * Reset Firestore to initial default demo data
 */
export async function resetFirestoreToDemoData(): Promise<void> {
  // 1. Reset settings
  const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  await setDoc(settingsDocRef, initialSchoolSettings);

  // 2. Clear & Reset Mading Posts
  const madingCollRef = collection(db, MADING_COLLECTION);
  const madingSnap = await getDocs(madingCollRef);
  const madingBatch = writeBatch(db);
  madingSnap.forEach((d) => {
    madingBatch.delete(d.ref);
  });
  initialMadingPosts.forEach((post) => {
    const postRef = doc(db, MADING_COLLECTION, post.id);
    madingBatch.set(postRef, post);
  });
  await madingBatch.commit();

  // 3. Clear & Reset Students
  const studentsCollRef = collection(db, STUDENTS_COLLECTION);
  const studentsSnap = await getDocs(studentsCollRef);
  const studentsBatch = writeBatch(db);
  studentsSnap.forEach((d) => {
    studentsBatch.delete(d.ref);
  });
  initialGraduationStudents.forEach((student) => {
    const studentRef = doc(db, STUDENTS_COLLECTION, student.id);
    studentsBatch.set(studentRef, student);
  });
  await studentsBatch.commit();

  // 4. Clear & Reset Staff Accounts
  const staffCollRef = collection(db, STAFF_COLLECTION);
  const staffSnap = await getDocs(staffCollRef);
  const staffBatch = writeBatch(db);
  staffSnap.forEach((d) => {
    staffBatch.delete(d.ref);
  });
  initialStaffAccounts.forEach((staff) => {
    const staffRef = doc(db, STAFF_COLLECTION, staff.id);
    staffBatch.set(staffRef, staff);
  });
  await staffBatch.commit();
}
