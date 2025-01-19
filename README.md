## Generate customizable portfolio site from LinkedIn Resume

[![Demo video](http://img.youtube.com/vi/M9KssZnfZrw/maxresdefault.jpg)](https://www.youtube.com/watch?v=M9KssZnfZrw)

This project is a simple way to generate a customizable portfolio site from your LinkedIn resume. 
The tool can extract portfolio details from the downloaded LinkedIn resume (PDF). The site is fully customizable and can be easily modified to fit your needs.

## Features
- Extract portfolio details from LinkedIn resume (PDF)
- Generate a customizable portfolio site
- Fully customizable

## Prerequisites
- `gh` - [GitHub CLI](https://cli.github.com/) (which is already authenticated with your GitHub account.
- `pnpm` - Node pacakge manager

## Installation 
1. Clone the repository
```bash
git clone
```

2. Configuration
The tool uses environment variables for configuration. You can create a `.env` file in the project root to set these variables. The following environment variables are used:
- `ANTHROPIC_API_KEY`: Your API key for the Anthropic service.

## Usage
To use the tool, follow these steps:
1. Ensure you have the prerequisites installed.
2. Clone the repository and navigate to the project directory.
3. Make the `generate-portfolio.sh` script executable:
   ```bash
   chmod +x generate-portfolio.sh
   ```
4. Run the script to generate your portfolio:
   ```bash
   ./generate-portfolio.sh
   ```

## Contributing
We welcome contributions to this project! To contribute, follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b my-feature-branch
   ```
3. Make your changes and commit them with a descriptive commit message.
4. Push your changes to your forked repository:
   ```bash
   git push origin my-feature-branch
   ```
5. Open a pull request to the main repository.

