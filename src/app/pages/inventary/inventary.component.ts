import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/services/crud.service';
import { Product } from 'src/app/models/product.model';
import { icons } from 'src/app/environments/icons';
import { Inventario } from 'src/app/models/inventario.model';
import { DatePipe } from '@angular/common';

const edit_icon = icons.edit_icon;
const delete_icon = icons.delete_icon;

@Component({
  selector: 'app-inventary',
  templateUrl: './inventary.component.html',
  styleUrls: ['./inventary.component.scss']
})
export class InventaryComponent {

  edit_icon: string = edit_icon;
  delete_icon: string = delete_icon;

}
