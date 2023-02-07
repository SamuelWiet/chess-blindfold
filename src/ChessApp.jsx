import React from "react";
import { useTable } from "react-table";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, Col, FormControl, Row } from "react-bootstrap";
import Chessdiagram from "react-chessdiagram";
import { defaultGetRows } from "./helpers.jsx";
import styles from "./App.css";

const lightSquareColor = "#f2f2f2";
const darkSquareColor = "#bfbfbf";

const width = window.innerWidth;
const maxSquareSize = 50;
const squareSize = Math.min(width / 10, maxSquareSize);

const cols = [
  {
    Header: "Move",
    accessor: "moveNumber",
  },
  {
    Header: "White",
    accessor: "white",
  },
  {
    Header: "Black",
    accessor: "black",
  },
];

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }

    td {
      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          // eslint-disable-next-line react/jsx-key
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              // eslint-disable-next-line react/jsx-key
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            // eslint-disable-next-line react/jsx-key
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                // eslint-disable-next-line react/jsx-key
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

Table.propTypes = {
  data: PropTypes.any,
  columns: PropTypes.any,
};

export class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  flipBoard = false;

  render = () => {
    const handleClick = () => {
      this.flipBoard = this.flipBoard ? false : true;
      this.forceUpdate();
    };

    return (
      <div>
        <Row style={{ marginTop: 20 }}>
          <Col>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Chessdiagram
                flip={this.flipBoard}
                fen={this.props.fen}
                squareSize={squareSize}
                lightSquareColor={lightSquareColor}
                darkSquareColor={darkSquareColor}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <div className="text-center">
              <Button
                style={{ height: 40 }}
                className={styles.flipBoardButton}
                variant="primary"
                id="flipButton"
                onClick={handleClick}
              >
                Flip
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };
}

Board.propTypes = {
  fen: PropTypes.string,
};

export class MoveTable extends React.Component {
  constructor(props) {
    super(props);
  }
  getMoves = () => defaultGetRows(this.props.pgn());
  rowMapper = (row) => ({
    moveNumber: row[0],
    white: row[1],
    black: row[2],
  });
  getData = () => this.getMoves().map(this.rowMapper);
  render = () => {
    var data = this.getData();
    if (data.length == 0)
      return <div style={{ textAlign: "center" }}>No moves yet</div>;
    var pgnValue = this.props.pgn();
    const handleChange = (event) => {
      pgnValue = event.target.value;
    };
    const handleClick = () => {
      this.props.load_pgn(pgnValue);
      this.forceUpdate();
    };

    return (
      <div>
        <Row className="justify-content-md-center">
          <Styles>
            <Table columns={cols} data={data} />
          </Styles>
        </Row>
        <div>
          <Row>
            <Col sm={{ span: 10, offset: 0 }}>
              <FormControl
                as="textarea"
                rows={3}
                onChange={handleChange}
                defaultValue={pgnValue}
              />
            </Col>
            <Col sm={2}>
              <Button
                id="submitButton"
                style={{ height: 50 }}
                className={styles.loadPgnButton}
                variant="primary"
                onClick={handleClick}
              >
                Load PGN
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  };
}

MoveTable.propTypes = {
  pgn: PropTypes.func,
  load_pgn: PropTypes.func,
};
