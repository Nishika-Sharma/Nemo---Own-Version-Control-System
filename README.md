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

## Example Usage

1. Initialize Repository
To initialize a new Nemo repository, use the following command:

    ```bash
    node Nemo.mjs init
    ```

This command creates a `.nemo` directory that will store all the version control data.


2. Add Files

    ```bash
    node Nemo.mjs add sample.txt
    ```

    ```bash
    node Nemo.mjs add sample2.txt
    ```

This will stage the specified files, making them ready for commit.


3. Commit Changes

    ```bash
    node Nemo.mjs commit "Initial commit"
    ```

The commit command saves the changes and tracks the state of the project at that point in time.


4. View Commit Log

    ```bash
    node Nemo.mjs log
    ```

This will show the commit hash, date, and message for each commit in the repository.


5. Show Commit Differences

    ```bash
    node Nemo.mjs show <commitHash>
    ```

Replace `<commitHash>` with the actual hash of the commit you want to inspect. This command shows the changes between the specified commit and its parent commit, highlighting added and removed lines.

---

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
