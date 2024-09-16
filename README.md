# Nemo

Nemo is a simple version control system designed to help you track changes in your files and manage commits.

## Features

- Initialize a new repository
- Add files to staging area
- Commit changes with messages
- View commit logs
- Show differences between commits

## Getting Started

To get started with Nemo, follow these steps:

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. To initialize a new Nemo repository:
    ```bash
    node Nemo.mjs init
    ```

4. Add files to your staging area:
    ```bash
    node Nemo.mjs add <filename>
    ```

5. Commit changes:
    ```bash
    node Nemo.mjs commit "commit message"
    ```

6. View commit logs:
    ```bash
    node Nemo.mjs log
    ```

7. Show differences between commits:
    ```bash
    node Nemo.mjs show <commitHash>
    ```

## Project Structure

- `.nemo`: Contains the tracking information (like `objects`, `index`, and `HEAD`).
- `objects`: Stores the hashed files.
- `index`: Staging area for tracking changes.
- `HEAD`: Points to the latest commit.

## Contributing

We welcome contributions from the community! Feel free to fork the repository and submit pull requests to help improve Nemo.

## Documentation

Nemo uses a .nemo folder inside project directory to store all necessary tracking information such as objects (hashed file content), commit history, and the current HEAD.

## License

Nemo is released under the [MIT License](https://opensource.org/license/MIT).
