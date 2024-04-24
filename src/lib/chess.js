function is_valid_move(x, y) {
  return 0 <= x && x < 8 && 0 <= y && y < 8;
}

function knight_moves(start, end) {
  const dx = [1, 2, 2, 1, -1, -2, -2, -1];
  const dy = [2, 1, -1, -2, -2, -1, 1, 2];
  const visited = Array.from({ length: 8 }, () => Array(8).fill(false));
  const parent = Array.from({ length: 8 }, () => Array(8).fill(null));
  const queue = [[start[0], start[1]]];
  visited[start[0]][start[1]] = true;
  while (queue.length) {
    const [x, y] = queue.shift();
    if (x === end[0] && y === end[1]) {
      const path = [];
      let current = [x, y];
      while (current[0] !== start[0] || current[1] !== start[1]) {
        path.push(current);
        current = parent[current[0]][current[1]];
      }
      path.push(start);
      path.reverse();
      return [path.length - 1, path];
    }
    for (let i = 0; i < 8; i++) {
      const new_x = x + dx[i];
      const new_y = y + dy[i];
      if (is_valid_move(new_x, new_y) && !visited[new_x][new_y]) {
        visited[new_x][new_y] = true;
        parent[new_x][new_y] = [x, y];
        queue.push([new_x, new_y]);
      }
    }
  }
  return [-1, []];
}

function chess_notation(coords) {
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const file = letters[coords[0]];
  const rank = coords[1] + 1;
  return file + rank;
}

function is_valid_solution(path, start, end) {
  // Check if the start of the path matches the start parameter
  if (!path.length || !path[0].every((coord, index) => coord === start[index])) {
    return false;
  }

  // Check if the end of the path matches the end parameter
  if (!path[path.length - 1].every((coord, index) => coord === end[index])) {
    return false;
  }

  // Check if each step in the path represents a legal knight move
  for (let i = 1; i < path.length; i++) {
    const [prevX, prevY] = path[i - 1];
    const [currX, currY] = path[i];
    const dx = Math.abs(prevX - currX);
    const dy = Math.abs(prevY - currY);
    if (!((dx === 1 && dy === 2) || (dx === 2 && dy === 1))) {
      return false;
    }
  }

  return true;
}

function chess_notation_path_to_coords (path) {
  const ASCII_LOWERCASE_A = 'a'.charCodeAt(0); // ASCII value of lowercase 'a'
  return path.split(' ').map(coords => [coords.charCodeAt(0) - ASCII_LOWERCASE_A, parseInt(coords[1]) - 1]);
}

export {
  knight_moves,
  chess_notation,
  is_valid_solution,
  chess_notation_path_to_coords
};