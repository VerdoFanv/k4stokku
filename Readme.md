## Persiapan
> pastikan laptop/pc sudah terinstal nodejs (16^), git/github desktop, teks editr (sublime 4/visual studio code/visual studio)
- Jika belum ikuti langkah ini
- Install NodeJS recomended versi 16 [NodeJS](https://nodejs.org/en/blog/release/v16.18.1/) << sesuaikan dengan OS masing-masing, setelah download di install, lalu pastikan nodejs ada diperangkat caranya buka cmd/powershell kalia, lalu ketikkan perintah `node -v`, jika berhasil akan muncul teks `v16.18.1`
- Download & install github desktop [Github Desktop](https://desktop.github.com/)
- Download & install teks editor pilih salah satu
  - [Visual Studio Code](https://code.visualstudio.com/download)
  - [Sublime 4](https://www.sublimetext.com/download)
  
## Unduh Repo
- Buka github desktop, lalu tekan tombol clone repository, kemudian pada popup pilih tab URL, kemudian paste url ini `https://github.com/VerdoFanv/k4stokku.git` dan tekan clone (jangan lupa untuk mengatur lokasi folder clone, proses clone ini sama dengan download folder project ke komputer)
- Buka Visual Studio Code / Sublime kemudian pada tab File, pilih open folder dan arahkan pada lokasi clone sebelumnya

## Menjalankan Program
> Khusus yang menggunakan Visual Studio Code
- Setelah open folder, kemudian buka cmd/powershell pada vscode, dengan tekan tab Terminal >> New Terminal, maka terminal akan muncul pada pojok bawah
- jika sudah maka ketik perintah `npm install` pada cmd, tunggu hingga proses download selesai (tergantung koneksi / spek perangkat)
- Kemudian buat file `.env` pada root folder, kemudian isikan kode berikut
```
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
ACCESS_TOKEN_KEY="918862cb0bf1cfc671fdcb93dfd1433fa16c1ac041dfeb211d998925e93a419e56e732c858861582f02ed7a61ac9713d909d9f779799553583335f3fc284385e"
REFRESH_TOKEN_KEY="da2bb870a4389f259dc142efe7f6e6ece5ba1bc8af57e9bd3efdbae41ec7a417679ed4d843ad2d70e5e2889b0826266c9f6830db704252ad93dde4ca49d6dff6"

# dev
# DATABASE_URL="postgresql://postgres:2002@localhost:5432/k4stokku?schema=public"

#prod
DATABASE_URL="postgresql://postgres:RDuNHYu7VXNooe8l@db.krvwaunslytdcftkfhim.supabase.co:5432/postgres"

SUPABASE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydndhdW5zbHl0ZGNmdGtmaGltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2MzQ2Mzg0NiwiZXhwIjoxOTc5MDM5ODQ2fQ.Ml8n7EveOG7wTDbwABaa6oaDQ_i0tPMKlsj5TCRrF-k
SUPABASE_API_URL=https://krvwaunslytdcftkfhim.supabase.co
```

- setelah itu kembali ke cmd, ketik `npm run dev` lalu tunggu beberapa saat, lalu buka browser (disarankan chrome/firefox)
- pada address bar, ketik `localhost:3000`
  
> Khusus yang menggunakan sublime 4
- Setelah open folder, kemudian buka cmd/powershell komputer kalian, lalu arahkan pada folder clone/project yang dibuka pada sublime, contoh jika folder clone project ada di `D:\github\k4stokku` maka jalankan perintah ini pada cmd `cd D:\github\k4stokku`
- jika sudah maka ketik perintah `npm install` pada cmd, tunggu hingga proses download selesai (tergantung koneksi / spek perangkat)
- Kemudian buat file `.env` pada root folder, kemudian isikan kode berikut
```
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
ACCESS_TOKEN_KEY="918862cb0bf1cfc671fdcb93dfd1433fa16c1ac041dfeb211d998925e93a419e56e732c858861582f02ed7a61ac9713d909d9f779799553583335f3fc284385e"
REFRESH_TOKEN_KEY="da2bb870a4389f259dc142efe7f6e6ece5ba1bc8af57e9bd3efdbae41ec7a417679ed4d843ad2d70e5e2889b0826266c9f6830db704252ad93dde4ca49d6dff6"

# dev
# DATABASE_URL="postgresql://postgres:2002@localhost:5432/k4stokku?schema=public"

#prod
DATABASE_URL="postgresql://postgres:RDuNHYu7VXNooe8l@db.krvwaunslytdcftkfhim.supabase.co:5432/postgres"

SUPABASE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydndhdW5zbHl0ZGNmdGtmaGltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2MzQ2Mzg0NiwiZXhwIjoxOTc5MDM5ODQ2fQ.Ml8n7EveOG7wTDbwABaa6oaDQ_i0tPMKlsj5TCRrF-k
SUPABASE_API_URL=https://krvwaunslytdcftkfhim.supabase.co
```

- setelah itu kembali ke cmd, ketik `npm run dev` lalu tunggu beberapa saat, lalu buka browser (disarankan chrome/firefox)
- pada address bar, ketik `localhost:3000`

> jika ingin stop run project, tekan tombol (ctrl + c pada windows) dan (control + c pada mac)
> Ingat selagi project running, jangan menutup/stop cmd