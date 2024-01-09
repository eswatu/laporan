export interface Document {
    id: string;
    dok_number: number;
    dok_date: Date;
    dok_name: string; 
    dok_item: Item[];
}

export interface Item {
    id: string;
    item_kode: string;
    item_uraian: string;
    item_catatan: string;
    item_files: Item_file[];
}
export interface Item_file {
    id: string;
    file_name: string;
    file_keterangan: string;
    url: string;
}