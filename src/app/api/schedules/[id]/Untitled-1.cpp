// Online C++ compiler to run C++ program online
#include <iostream>
using namespace std;

int n;

struct Mahasiswa {
    string nama;
    string nim;
    int umur;
};


string ulang;

int main() {

    do {

         cout<<"Masukkan Jumlah Data : ";cin>>n;
         Mahasiswa mhs[n];
    
        for(int a=0; a<n;a++){
            cout<<"Masukkan Nama Mahasiswa : ";cin>>mhs[a].nama;
            cout<<"Masukkan NIM Mahasiswa : ";cin>>mhs[a].nim;
            cout<<"Masukkan Umur Mahasiswa : ";cin>>mhs[a].umur;
        }
  
        cout<<"\nData Mahasiswa\n";
        for(int a=0; a<n;a++){
            cout<<"Nama Mahasiswa : "<<mhs[a].nama<<endl;
            cout<<"NIM Mahasiswa : "<<mhs[a].nim<<endl;
            cout<<"Umur Mahasiswa : "<<mhs[a].umur<<endl;
            cout<<endl;
        }

        

    } while (ulang == "y" || ulang == "Y");

    
   

    return 0;
}