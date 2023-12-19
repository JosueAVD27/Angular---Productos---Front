export interface Inventario {
  id?: number;
  producto_id: number;
  cantidad: number;
  fecha_movimiento: string;
  tipo_movimiento: string;
}
