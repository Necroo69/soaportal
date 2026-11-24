# soaportal

A static replica of the CampusPortal student UI: the drawer menu, the scrolling welcome header, material-style fields, and data tables that stack into label/value cards on phones.

## Pages
- Student Personal Info (tabs: Personal / Contact / Parents)
- Class Time Table
- Class Attendance (percentage is worked out from attended/total)
- Registered Subjects
- Admit Card
- Student Result (SGPA / CGPA table)

## Run
Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Editing data
All the content lives in `js/data.js`.
