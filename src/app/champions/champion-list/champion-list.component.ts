import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ColDef, RowValueChangedEvent } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Champion } from 'src/app/champions/champion.model';
import { ChampionService } from './champion.service';
import { switchMap } from 'rxjs/operators';


function actionCellRenderer(params: any) {
  let eGui = document.createElement("div");

  let editingCells = params.api.getEditingCells();
  // checks if the rowIndex matches in at least one of the editing cells
  let isCurrentRowEditing = editingCells.some((cell:any) => {
    return cell.rowIndex === params.node.rowIndex;
  });

  if (isCurrentRowEditing) {
    eGui.innerHTML = `
    <button  class="action-button update"  data-action="update"> update </button>
    <button  class="action-button cancel"  data-action="cancel"> cancel </button>
    `;
      } else {
        eGui.innerHTML = `
    <button class="action-button edit"  data-action="edit"> edit </button>
    <button class="action-button delete" data-action="delete"> delete </button>
    `;
  }

  return eGui;
}

@Component({
  selector: 'app-champion-list',
  templateUrl: './champion-list.component.html',
  styleUrls: ['./champion-list.component.scss']
})
export class ChampionListComponent implements OnInit {

  public columnDefs: ColDef[];
  public defaultColDef;
  public columnTypes;
  public rowData: Champion[];

  public gridApi:any;
  public gridColumnApi:any;

  constructor(private championService:ChampionService, private http: HttpClient) {
    this.columnDefs = [
      { headerName: '#', field: 'id', sortable: true, filter: true,
      type: ['nonEditableColumn'], width: 90, pinned: 'left', sort: 'asc',},
      { headerName: 'Title', field: 'title', sortable: true, filter: true, pinned: 'left' },
      { headerName: 'Name', field: 'name', sortable: true, filter: true},
      { headerName: 'Tags', field: 'tags', sortable: true, filter: true},
      {
        headerName: "Action",
        width: 170,
        filter: false,
        cellRenderer: actionCellRenderer,
        editable: false,
        colId: "action",
        pinned: 'right'
      }
    ];

    this.defaultColDef = {
      editable: true,
      resizable: true,
    };

    this.columnTypes = {
      nonEditableColumn: { editable: false },
      centerAligned: {
        headerClass: 'ag-center-aligned-header',
        cellClass: 'ag-center-aligned-cell'
      }
    }
    this.rowData = this.champions
   }

  champions: Champion[] = [];

  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  onCellClicked(params:any) {
    // Handle click event for action cells
    if (params.column.colId === "action" && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action;

      if (action === "edit") {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId
        });   
      }

      if (action === "delete") {
        params.api.applyTransaction({
          remove: [params.node.data]
        });
      }

      if (action === "update") {
        params.api.stopEditing(false);
      }

      if (action === "cancel") {
        params.api.stopEditing(true);
      }
    }
  }
  onRowEditingStarted(params:any) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }
  onRowEditingStopped(params:any) {
    params.api.refreshCells({
      columns: ["action"],
      rowNodes: [params.node],
      force: true
    });
  }
  onRowValueChanged(event: RowValueChangedEvent) {
    var data = event.data;
    this.championService.updateChampion(data);
  }

  ngOnInit(): void {
    this.getChampions()
    this.getFileData()
  }

  getChampions() {
    this.championService.getChampions().subscribe(champions => this.champions = champions);
  }

  getFileData() {
    let reader = new FileReader();
    fetch('assets/games.csv')
    .then((response) => response.text())
    .then(this.transform);
  }
  
  transform(csv:any) {
    console.log(csv.split("\r\n"));
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    
    for (var i = 1; i < lines.length - 1; i++) {
        var obj:any = {};
        var currentline = lines[i].split(",");
        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
        console.log(obj);
    }
  }
}
