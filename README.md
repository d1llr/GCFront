#front

git pull | delete GCFront & git clone https://github.com/d1llr/GCFront.git
npm install
pm2 start 'npm start'



#fakeBackEnd

Все данные для тестового бэка приходят из гита, лежат в файле db.json
Остается только запустить json-server, инициализиция происходит в файле server.js
pm2 start server.js --watch ./db.json --name json-server


