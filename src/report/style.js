const cellWidth = 150;

export const internalCss = `
  html{
    padding: 20px;
  }

  table, td, th {
    border: 1px solid black;
  }

  table {
    border-collapse: collapse;
    table-layout: auto;
    margin-bottom: 20px;
  }

  td {
    text-align: right;
    width: ${cellWidth}px;
  }

  td, th {
    padding: 5px;
  }

  li > p {
    margin: 10px 0px;
  }

  code {
    border: 1px solid #808080;
    border-radius: 3px;
    background-color: #eeeeee;
    padding: 0px 3px;
  }
`;
