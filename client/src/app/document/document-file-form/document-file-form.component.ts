import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Item_file } from '../../_models/document.interface';
import { DocumentService } from '../../_services/document.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'document-file-form',
  templateUrl: './document-file-form.component.html',
  styleUrl: './document-file-form.component.css',
})

export class DocumentFileFormComponent {
  @Input() file_items: Item_file[];
  images: any[] | undefined;
  collapse = true;
  isExpanded(){
    return this.collapse ? false : true
  }
  maxSizeOfFile: number = 1000000;
  uploadedFiles: any[] = [];
  constructor(private msgService: MessageService, private docService: DocumentService){}
  ngOnInit(){
    console.log(this.file_items);
    this.loadImgs();
  }
  onUpload() {
    // for(let file of event.files) {
    //     this.uploadedFiles.push(file);
    // }
  }
  loadImgs(){
    const imgNames = this.file_items.map(item => item.file_nama);
    imgNames.forEach(name => {
      this.docService.getImage(name).subscribe(res => {
        this.images.push(res);
      })
    })
  }
}
