# Firebase setup для Movie Mood

1. Создай проект в Firebase Console.
2. Добавь Web App и скопируй `firebaseConfig`.
3. Открой `firebase-config.js`, вставь config и поставь:

```js
enabled: true
```

4. В Firebase включи:
   - Firestore Database
   - Storage
   - Authentication -> Sign-in method -> Email/Password

5. В Authentication создай пользователя-админа: email + пароль.
6. В Firestore Rules вставь содержимое `firestore.rules`.
7. В Storage Rules вставь содержимое `storage.rules`.
8. Загрузи на GitHub Pages файлы проекта.
9. Админка будет доступна по адресу:

```text
https://mnacik1988.github.io/Movie-Codex/admin.html
```

Приложение будет брать фильмы из коллекции Firestore:

```text
movies
```

Если `enabled: false`, приложение работает по-старому на встроенных/локальных данных.
