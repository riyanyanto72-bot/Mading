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
const MADING_COLLECTION = 'mading_posts';
const STUDENTS_COLLECTION = 'students';
const STAFF_COLLECTION = 'staff_accounts';

/**
 * Automatically seeds default data to Firestore if the collections are empty.
 */
export async function initializeFirestoreDataIfEmpty(): Promise<void> {
  try {
    // Check with timeout guard to prevent offline block
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore init check timeout')), 4000)
    );

    await Promise.race([
      (async () => {
        // 1. Check settings
        const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
        const settingsSnap = await getDoc(settingsDocRef);

        if (!settingsSnap.exists()) {
          console.log('Seeding initial school settings to Firestore...');
          await setDoc(settingsDocRef, initialSchoolSettings);
        }

        // 2. Check mading posts
        const madingCollRef = collection(db, MADING_COLLECTION);
        const madingSnap = await getDocs(madingCollRef);

        if (madingSnap.empty) {
          console.log('Seeding initial mading posts to Firestore...');
          const batch = writeBatch(db);
          initialMadingPosts.forEach((post) => {
            const postRef = doc(db, MADING_COLLECTION, post.id);
            batch.set(postRef, post);
          });
          await batch.commit();
        }

        // 3. Check students
        const studentsCollRef = collection(db, STUDENTS_COLLECTION);
        const studentsSnap = await getDocs(studentsCollRef);

        if (studentsSnap.empty) {
          console.log('Seeding initial graduation students to Firestore...');
          const batch = writeBatch(db);
          initialGraduationStudents.forEach((student) => {
            const studentRef = doc(db, STUDENTS_COLLECTION, student.id);
            batch.set(studentRef, student);
          });
          await batch.commit();
        }

        // 4. Check staff (Guru & Admin)
        const staffCollRef = collection(db, STAFF_COLLECTION);
        const staffSnap = await getDocs(staffCollRef);

        if (staffSnap.empty) {
          console.log('Seeding initial staff accounts to Firestore...');
          const batch = writeBatch(db);
          initialStaffAccounts.forEach((staff) => {
            const staffRef = doc(db, STAFF_COLLECTION, staff.id);
            batch.set(staffRef, staff);
          });
          await batch.commit();
        }
      })(),
      timeoutPromise,
    ]);
  } catch (error) {
    // Gracefully handle offline or slow connection — app continues using local fast-cache smoothly
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
  await setDoc(docRef, settings, { merge: true });
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
  await setDoc(postRef, post, { merge: true });
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
  await setDoc(studentRef, student, { merge: true });
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
    batch.set(studentRef, student, { merge: true });
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
  await setDoc(staffRef, staff, { merge: true });
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
