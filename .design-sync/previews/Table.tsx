import { Badge, Table } from "puxel";

export function Leaderboard() {
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player</th>
          <th>Score</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>LUM</td>
          <td>999,999</td>
          <td>
            <Badge variant="success">Online</Badge>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>AAA</td>
          <td>512,340</td>
          <td>
            <Badge variant="warning">Idle</Badge>
          </td>
        </tr>
        <tr>
          <td>3</td>
          <td>ZZZ</td>
          <td>404,404</td>
          <td>
            <Badge variant="danger">Rage quit</Badge>
          </td>
        </tr>
        <tr>
          <td>4</td>
          <td>QRS</td>
          <td>128,002</td>
          <td>
            <Badge variant="success">Online</Badge>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

export function Plain() {
  return (
    <Table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Rusty sword</td>
          <td>1</td>
        </tr>
        <tr>
          <td>Health potion</td>
          <td>4</td>
        </tr>
      </tbody>
    </Table>
  );
}
