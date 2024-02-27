

document.addEventListener('DOMContentLoaded', function() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.querySelector('.output');

  terminalInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const command = terminalInput.value.trim();
      terminalInput.value = '';
      executeCommand(command);
    }
  });

  function executeCommand(command) {
    const args = command.split(' ');
    const cmd = args[0];
    const params = args.slice(1);

    if (cmd === 'help') {
      printOutput('Available commands: ' + '\n');
      printOutput('-----> commits <username> <repository>' + '\n');
      printOutput('-----> clear' + '\n');
    } else if (cmd === 'commits') {
      if (params.length !== 2) {
        printOutput('Usage: commits <username> <repository>');
      } else {
        const username = params[0];
        const repository = params[1];
        fetchCommitHistory(username, repository);
      }
    } else if (cmd === 'clear') {
      clearTerminal();
    } else {
      const errorline = document.createElement("div");
      const errorLine1 = document.createElement("span");
      errorLine1.className = "textError";
      errorLine1.innerText = "Command not found: ";
      const errorLine2 = document.createElement("span");
      errorLine2.className = "errorCommand";
      errorLine2.innerText = `${command}`;
      errorline.appendChild(errorLine1);
      errorline.appendChild(errorLine2);

      terminalOutput.appendChild(errorline)

    }
  }

  function fetchCommitHistory(username, repository) {
    fetch(`https://api.github.com/repos/${username}/${repository}/commits`)
      .then(response => response.json())
      .then(data => {
        printOutput(`Commit History for ${repository}:`, "outputText");
        const outputCommits = document.createElement("div");
        data.slice(0,5).forEach(commit => {
          const line = document.createElement("div")
          const commitCode = document.createElement("span");
          commitCode.className = "gitCommitCode";
          commitCode.innerText = commit.sha.substring(0,7);
          const commitMssg = document.createElement("span");
          commitMssg.className = "gitCommitMssg";
          commitMssg.innerText = ` - ${commit.commit.message}`;
          line.appendChild(commitCode);
          line.appendChild(commitMssg);
          outputCommits.appendChild(line);
        });

        terminalOutput.appendChild(outputCommits);
      })
      .catch(error => {
        printOutput('Error fetching commit history');
        console.error(error);
      });
  }

  function clearTerminal() {
    terminalOutput.innerHTML = ''; // Clear the output area
  }

  function printOutput(message, classname = "") {
    const outputLine = document.createElement('div');
    outputLine.className = classname;
    outputLine.textContent = message;
    terminalOutput.appendChild(outputLine);
  }
});
