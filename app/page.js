'use client'
import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [total, setTotal] = useState(0);

  // Update total whenever items change
  useEffect(() => {
    const newTotal = items.reduce((acc, item) => acc + parseFloat(item.price), 0);
    setTotal(newTotal.toFixed(2));
  }, [items]);

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.price !== '') {
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        price: parseFloat(newItem.price),
      });

      // Reset input fields
      setNewItem({ name: '', price: '' });
    }
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

      // Calculate total
      const totalPrice = itemsArr.reduce((sum, item) => sum + parseFloat(item.price), 0);
      setTotal(totalPrice.toFixed(2));
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Delete item from database
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
      // Update local state to remove the deleted item
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4" style={{ backgroundColor: '#FFE5B4' }}>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className='text-4xl p-4 text-center' style={{ color: '#8B4513' }}>Expense Tracker</h1>
        <div className='p-4 rounded-lg' style={{ backgroundColor: '#FFAB76' }}>
          <form className='grid grid-cols-6 items-center text-black' onSubmit={addItem}>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className='col-span-3 p-3 border'
              type="text"
              placeholder='Enter Item'
              style={{ borderColor: '#FF7F50' }}
            />
            <input
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className='col-span-2 p-3 border mx-3'
              type="number"
              placeholder='Enter $'
              style={{ borderColor: '#FF7F50' }}
            />
            <button
              className="text-white p-3 text-xl"
              style={{ backgroundColor: '#CD5C5C' }}
              type='submit'>
              +
            </button>
          </form>
          <ul>
            {items.map((item) => (
              <li key={item.id} className='my-4 w-full flex justify-between' style={{ backgroundColor: '#F4A460' }}>
                <div className='p-4 w-full flex justify-between'>
                  <span className='capitalize' style={{ color: '#8B4513' }}>{item.name}</span>
                  <span style={{ color: '#8B4513' }}>${item.price}</span>
                </div>
                <button
                  className='ml-8 p-4 border-l-2 w-16'
                  style={{ borderColor: '#FF7F50', backgroundColor: '#FA8072' }}
                  aria-label={`Delete ${item.name}`}
                  onClick={() => deleteItem(item.id)}>
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length > 0 && (
            <div className='flex justify-between p-3'>
              <span style={{ color: '#8B4513' }}>Total</span>
              <span style={{ color: '#8B4513' }}>${total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}