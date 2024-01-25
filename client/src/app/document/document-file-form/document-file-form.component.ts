import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Item_file } from '../../_models/document.interface';
import { DocumentService } from '../../_services/document.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'document-file-form',
  templateUrl: './document-file-form.component.html',
  styleUrl: './document-file-form.component.css',
})

export class DocumentFileFormComponent implements OnInit {
  @Input() file_items: Item_file[];
  images: any[] | undefined;
  responsiveOptions: any[] | undefined;
  collapse = true;
  isExpanded(){
    return this.collapse ? false : true
  }
  maxSizeOfFile: number = 1000000;
  uploadedFiles: any[] = [];
  constructor(private msgService: MessageService,
    private docService: DocumentService,
    private sanitizer: DomSanitizer){}
  ngOnInit(){
    this.loadImgs();
    this.responsiveOptions = [
      {
          breakpoint: '1199px',
          numVisible: 1,
          numScroll: 1
      },
      {
          breakpoint: '991px',
          numVisible: 2,
          numScroll: 1
      },
      {
          breakpoint: '767px',
          numVisible: 1,
          numScroll: 1
      }
  ];
    // console.log(this.file_items);
  }
  onUpload() {
    // for(let file of event.files) {
    //     this.uploadedFiles.push(file);
    // }
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
    console.log(this.images);
  }
  blobToUrl(blob: Blob) {
    const imageUrl = URL.createObjectURL(blob);
    console.log('blob-url ', imageUrl);
    return  this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
  }
}
