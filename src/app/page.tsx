'use client';
import React, { useState, useEffect } from 'react';
import {addItemToDB,deleteItemFromDB,getDataFromDB,updateItemInDB} from "../services/crudServices"
import {
  collection,  
  query,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

export default function Home() {
  const [items, setItems] = useState([
    // { name: 'Coffee', price: 4.95 },
    // { name: 'Movie', price: 24.95 },
    // { name: 'candy', price: 7.95 },
  ]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [total, setTotal] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemKey, setEditingItemKey] = useState();
  


  // Add item to database
  const addItem = async (e) => {
    await addItemToDB(e,newItem)
    setNewItem({ name: '', price: '' });
    
  };

  // Read items from database
  
  
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      // Read total from itemsArr
      const calculateTotal = () => {
        const totalPrice = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.price),
          0
        );
        setTotal(totalPrice);
      };
      calculateTotal();
      return () => unsubscribe();
    });
  }, []);

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteItemFromDB(id);
  };
  

  const enableEditing = (id)=>{
    setEditingItemKey(id)
    setNewItem({ name: '', price: '' });
    setIsEditing((prev)=> !prev)
  }
  const discardEditing = ()=>{
    setIsEditing(false)
    setEditingItemKey('')
  }

  // update item to database
  const updateItem = async (e,id) => {
    await updateItemInDB(e,id,newItem)
    setNewItem({ name: '', price: '' });
  };


  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm '>
        <h1 className='text-4xl p-4 text-center'>Expense Tracker</h1>
        <div className='bg-slate-800 p-4 rounded-lg'>
          <form className='grid grid-cols-6 items-center text-black'>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className='col-span-3 p-3 border'
              type='text'
              placeholder='Enter Item'
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className='col-span-2 p-3 border mx-3'
              type='number'
              placeholder='Enter $'
            />
            <button
              onClick={addItem}
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl'
              type='submit'
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between text-white'>
                  {
                    isEditing && editingItemKey === item.id ?
                    <>
                    <form className='grid grid-cols-6 items-center text-black'>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className='col-span-3 p-3 border'
              type='text'
              placeholder='Enter Item'
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className='col-span-2 p-3 border mx-3'
              type='number'
              placeholder='Enter $'
            />
            <button
              onClick={(e)=> updateItem(e,item.id)}
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl'
              type='submit'
            >
              save
            </button>
          </form>
                    </>
                    :
                    <>
                  <span className='capitalize text-white'>{item.name}</span>
                  <span>${item.price}</span>
                    </>
                  }
                </div>
                <button
                  onClick={() => !isEditing ? deleteItem(item.id) : discardEditing()}
                  className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16 text-white'
                >
                  X
                </button>
                {
                  !isEditing && editingItemKey !== item.id && 

                <button
                  onClick={() => enableEditing(item.id)}
                  className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16 text-white'
                >
                  U
                </button>
                }
                
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            ''
          ) : (
            <div className='flex justify-between p-3 text-white'>
              <span>Total</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
