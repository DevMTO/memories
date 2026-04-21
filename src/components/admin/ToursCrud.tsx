import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../infrastructure/firebaseClient';
import type { Tour } from '../../core/domain/models';

export default function ToursCrud() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Tour>>({});

  const { data: tours, isLoading } = useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'tours'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
    }
  });

  const addMutation = useMutation({
    mutationFn: async (newTour: Omit<Tour, 'id'>) => {
      await addDoc(collection(db, 'tours'), newTour);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tours'] })
  });

  const updateMutation = useMutation({
    mutationFn: async (tour: Partial<Tour> & { id: string }) => {
      const { id, ...data } = tour;
      await updateDoc(doc(db, 'tours', id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, 'tours', id));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tours'] })
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      addMutation.mutate(formData as Omit<Tour, 'id'>);
    }
    setFormData({});
  };

  const editTour = (tour: Tour) => {
    setEditingId(tour.id);
    setFormData(tour);
  };

  return (
    <div className="crud-container">
      <style>{`
        .crud-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: sans-serif; }
        .crud-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .crud-form { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: grid; gap: 15px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        input, textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
        button { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; background: #10594c; color: white; }
        .btn-delete { background: #dc3545; }
        .btn-edit { background: #ffc107; color: black; }
        .tours-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .tour-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
      `}</style>
      
      <div className="crud-header">
        <h2>Gestión de Tours</h2>
      </div>

      <form className="crud-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Editar Tour' : 'Nuevo Tour'}</h3>
        <div className="form-row">
          <input type="text" placeholder="Título" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <input type="number" placeholder="Precio ($)" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
        </div>
        <div className="form-row">
          <input type="number" placeholder="Días" value={formData.durationDays || ''} onChange={e => setFormData({...formData, durationDays: Number(e.target.value)})} required />
          <input type="number" placeholder="Noches" value={formData.durationNights || ''} onChange={e => setFormData({...formData, durationNights: Number(e.target.value)})} />
        </div>
        <input type="text" placeholder="URL Imagen" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} required />
        <textarea placeholder="Descripción" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} required />
        <input type="text" placeholder="Ciudades (separadas por coma)" value={formData.cities?.join(', ') || ''} onChange={e => setFormData({...formData, cities: e.target.value.split(',').map(s=>s.trim())})} />
        
        <div className="form-actions">
          <button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>
            {editingId ? 'Actualizar Tour' : 'Guardar Nuevo Tour'}
          </button>
          {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({});}} style={{marginLeft: '10px', background: '#6c757d'}}>Cancelar</button>}
        </div>
      </form>

      {isLoading ? <p>Cargando tours...</p> : (
        <div className="tours-grid">
          {tours?.map(tour => (
            <div key={tour.id} className="tour-card">
              <h4>{tour.title}</h4>
              <p>{tour.durationDays} Días / {tour.durationNights || tour.durationDays - 1} Noches</p>
              <p><strong>Precio:</strong> ${tour.price}</p>
              <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
                <button className="btn-edit" onClick={() => editTour(tour)}>Editar</button>
                <button className="btn-delete" onClick={() => deleteMutation.mutate(tour.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
