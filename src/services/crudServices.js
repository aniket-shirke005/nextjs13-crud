import {
    collection,
    addDoc,
    getDoc,
    querySnapshot,
    query,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc
  } from 'firebase/firestore';
import { db } from '../app/firebase';

const addItemToDB = async (e,newItem) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.price !== '') {
      // setItems([...items, newItem]);
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        price: newItem.price,
      });
    }
  };

  const getDataFromDB = async ()=>{
    const q = query(collection(db, 'items'));
    let itemsArr = [];

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        
        querySnapshot.forEach((doc) => {
          itemsArr.push({ ...doc.data(), id: doc.id });
        });
        
        return () => unsubscribe();
      });

      return itemsArr
  }

  const deleteItemFromDB = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  const updateItemInDB = async (e,id,newItem) => {
    e.preventDefault()

    if (newItem.name !== '' && newItem.price !== '') {
      const itemRef = doc(db, 'items', id);
      await updateDoc(itemRef, {
        name: newItem?.name.trim(),
        price: newItem?.price,
      });
    }

    const itemRef = doc(db, 'items', id);
    await updateDoc(itemRef, {
      name: newName.trim(),
      price: newPrice,
    });
  };
  


  export {addItemToDB,getDataFromDB,deleteItemFromDB,updateItemInDB}