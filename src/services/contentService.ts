import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export const getPageContent = async (pageId: string) => {
  try {
    const docRef = doc(db, 'content', pageId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data;
    }
  } catch (error) {
    console.error(`Error fetching ${pageId} content:`, error);
  }
  return null;
};
