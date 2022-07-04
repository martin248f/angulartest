import { MiaPagination } from '@agencycoda/mia-core';
import { MiaField, MiaFormConfig } from '@agencycoda/mia-form';
import { MiaTableConfig } from '@agencycoda/mia-table';
import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Client } from './entities/client';
import { ClientService } from './services/client.service';
import { MiaFormModalComponent, MiaFormModalConfig } from '@agencycoda/mia-form';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'coda-test-angular';
  tableConfig: MiaTableConfig = new MiaTableConfig();
  mockData?: MiaPagination<any>;

  item = new Client;

  constructor(
    protected clientService:ClientService,
    protected dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.loadConfig();
  }

  loadConfig() {
    this.tableConfig.service = this.clientService;
    this.tableConfig.id = 'table-test';
    this.tableConfig.columns = [
      { key: 'id', type: 'string', title: 'ID', field_key: 'id'},
      { key: 'firstname', type: 'string', title: 'First Name', field_key: 'firstname'},
      { key: 'lastname', type: 'string', title: 'Last Name', field_key: 'lastname'},
      { key: 'email', type: 'string', title: 'Email', field_key: 'email'},
      { key: 'address', type: 'string', title: 'Address', field_key: 'address'},
      { key: 'more', type: 'more', title: '', extra: {
        actions: [
          { icon: 'create', title: 'Edit', key: 'edit' },
          { icon: 'delete', title: 'Delete', key: 'remove' },
        ]
      } },      
    ];

    this.tableConfig.loadingColor = 'red';
    this.tableConfig.hasEmptyScreen = true;
    this.tableConfig.emptyScreenTitle = 'No tenes cargado ningun elemento todavia';

    this.tableConfig.onClick.subscribe(result => {
      console.log('--ACTION--');
      console.log(result.key);
      if (result.key == 'edit') {
        this.onClickOpenForm(result.item)
      }
      if (result.key == 'remove') {
        console.log(result.item);
        this.clientService.removeOb(result.item.id).subscribe( res => {
          console.log(res);
        });
      
      }
    });

    this.mockData = {
      current_page: 1,
      first_page_url: '',
      from: '',
      last_page: 1,
      last_page_url: '',
      next_page_url: '',
      path: '',
      per_page: 50,
      prev_page_url: '',
      to: '',
      total: 1,
      data: [
        {
          id: 1, role_id: 1, title: 'asdasdasd', firstname: 'Matias', lastname: 'Camiletti', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png', subtitle: 'Administrador', is_online: 0, status: 1, created_at: '1989-08-25 18:00:00'
        },
        {
          id: 2, role_id: 3, title: 'asdasdasd', firstname: 'Matias', lastname: 'Camiletti', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png', subtitle: 'Administrador', is_online: 0, status: 1, created_at: '1989-08-25 18:00:00', categories: [ { title: 'category One'}, { title: 'category Two'} ]
        },
        {
          id: 3, role_id: 1, title: 'asdasdasd', firstname: 'Matias', lastname: 'Camiletti', photo: '', subtitle: 'Administrador', is_online: 0, created_at: '1989-08-25 18:00:00'
        },
        {
          id: 4, role_id: 4, title: 'asdasdasd', firstname: 'Matias', lastname: 'Camiletti', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/User_icon_2.svg/220px-User_icon_2.svg.png', subtitle: 'Administrador', is_online: 0, status: 1, created_at: '1989-08-25 18:00:00'
        }
      ]
    };

  }

  onClickOpenForm(item?:Client) {
    let data = new MiaFormModalConfig();
    if (item) {
      console.log('editar');
      data.item = item;
    } else {
      console.log('crear');
      data.item = this.item
    }

    data.service = this.clientService;
    data.titleNew = 'Create Contact';
    data.titleEdit = 'Edit Contact';

    let config = new MiaFormConfig();
    config.hasSubmit = false;
    config.fields = [
      {key:'firstname',type: MiaField.TYPE_STRING, label: 'First name', validators:[Validators.required]},
      {key:'lastname',type: MiaField.TYPE_STRING, label: 'Last name', validators:[Validators.required]},
      {key:'email',type: MiaField.TYPE_STRING, label: 'Email', validators:[Validators.required]},
    ];
    config.errorMessages = [{key:'required',message:'The "%label%" is required.'}];

    data.config = config;

    return this.dialog.open(MiaFormModalComponent, {
      width: '520px',
      panelClass: 'modal-full-width-mobile',
      data: data
    }).afterClosed()
    
  }


}
