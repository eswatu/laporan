import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Item_file } from '../../_models/document.interface';
import { DocumentService } from '../../_services/document.service';
import { DomSanitizer} from '@angular/platform-browser';
import { FileUpload } from 'primeng/fileupload';

interface UploadEvent{
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'document-file-form',
  templateUrl: './document-file-form.component.html',
  styleUrl: './document-file-form.component.css',
})

export class DocumentFileFormComponent implements OnInit {
  @ViewChild('uploader') uploader: FileUpload;
  @Input() file_items: Item_file[];
  @Input() document_id: string;
  @Input() item_id: string;

  images: any[] | undefined;
  responsiveOptions: any[] | undefined;

  maxSizeOfFile: number = 5000000;
  uploadedFiles: File[] = [];
  constructor(private msgService: MessageService,
    private docService: DocumentService,
    private sanitizer: DomSanitizer){}
  ngOnInit(){
    this.loadImgs();
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
  ];
    // console.log(this.file_items);
  }
  startUpload(event: any) {
    if (event.files && event.files.length > 0) {
      for (let item of event.files) {
        const formData = new FormData();
        formData.append('file', item);
        this.docService.uploadFile(formData, this.document_id, this.item_id).subscribe(res => {
          console.log(res);
          this.msgService.add({severity: 'info', summary: 'File Terupload', detail: res.message});
        }, err => {
          console.log(err);
        });
      }
    }
  }
  clearInput(){
    this.uploader.clear();
    this.uploadedFiles = [];
  }
  loadImgs(){
    this.images = [];
    if (this.file_items.length > 0) {
      const imgNames = this.file_items.map(item => item.file_nama);
      imgNames.forEach(name => {
        this.docService.getImage(name).subscribe((res) => {
          // console.log(res)
          this.images.push(this.blobToUrl(res));
        })
      })
    }
    // init
    // console.log(this.images);
  }
  blobToUrl(blob: Blob) {
    const imageUrl = URL.createObjectURL(blob);
    // console.log('blob-url ', imageUrl);
    return  this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
  }
}
