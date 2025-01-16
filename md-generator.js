import fs from "fs";
import path from "path";

function formatDate(dateString) {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function generateAboutMarkdown(basicsJson, educationJson = []) {
  let markdown = "# About Me\n\n";

  // Basics Section
  markdown += "## Basics\n";
  markdown += `Name: ${basicsJson.name}\n`;
  markdown += `Headline: ${basicsJson.headline}\n`;

  // Location
  const location = basicsJson.location;
  markdown += `Location: ${location.city}, ${location.state}, ${location.country}\n`;

  // Summary
  if (basicsJson.summary) {
    markdown += `Summary: ${basicsJson.summary}\n`;
  }

  // Education Section (if provided)
  if (educationJson && educationJson.length > 0) {
    markdown += "\n## Education\n";

    educationJson.forEach((edu) => {
      markdown += `### ${edu.institution}\n`;

      // Build the education headline
      let eduHeadline = [];
      if (edu.studyType || edu.area) {
        eduHeadline.push(`${edu.studyType || ""} ${edu.area || ""}`.trim());
      }

      // Add dates if available
      const startYear = edu.startDate ? formatDate(edu.startDate) : "";
      const endYear = edu.endDate ? formatDate(edu.endDate) : "present";
      if (startYear || endYear) {
        eduHeadline.push(`${startYear}-${endYear}`);
      }

      if (eduHeadline.length > 0) {
        markdown += `${eduHeadline.join(" | ")}\n`;
      }
    });
  }

  return markdown;
}

function generateContactMarkdown(contactData) {
  let markdown = "# Contact\n";

  if (contactData.email) {
    markdown += `* Email: ${contactData.email}\n`;
  }

  // Handle all social profiles (Linkedin, etc.)
  if (contactData.socialProfiles && contactData.socialProfiles.length > 0) {
    contactData.socialProfiles.forEach((profile) => {
      let username = profile.url;

      if (profile.network.toLowerCase() === "github") {
        username = profile.url
          .replace("https://github.com/", "")
          .replace("https://www.github.com/", "")
          .replace(/\/$/, "");
        markdown += `* GitHub: ${username}\n`;
      } else {
        username = profile.url
          .replace(/^https?:\/\/(www\.)?/, "")
          .replace(/\/$/, "");
        markdown += `* ${profile.network}: ${username}\n`;
      }
    });
  }

  return markdown;
}
function generateWorkMarkdown(workData) {
  let markdown = "# Experience\n";

  workData.forEach((company) => {
    markdown += `## ${company.company}\n`;

    // Handle single position case
    if (company.position) {
      const startDate = company.startDate ? formatDate(company.startDate) : "";
      const endDate = company.endDate ? formatDate(company.endDate) : "present";
      const duration = `${startDate} – ${endDate}`;

      markdown += `**${company.position}** | ${duration}\n`;

      if (company.description) {
        const descriptions = company.description.split("\n");
        descriptions.forEach((desc) => {
          if (desc.trim()) {
            markdown += `- ${desc.trim()}\n`;
          }
        });
      }
    }

    // Handle multiple positions case
    if (company.positions && company.positions.length > 0) {
      company.positions.forEach((position) => {
        const startDate = formatDate(position.startDate);
        const endDate = position.endDate
          ? formatDate(position.endDate)
          : "present";
        const duration = `${startDate} – ${endDate}`;

        markdown += `**${position.title}** | ${duration}\n`;

        if (position.description) {
          const descriptions = position.description.split("\n");
          descriptions.forEach((desc) => {
            if (desc.trim()) {
              markdown += `- ${desc.trim()}\n`;
            }
          });
        }

        if (position.technologies) {
          markdown += `- Technologies: ${position.technologies}\n`;
        }
      });
    }

    markdown += "\n";
  });

  return markdown;
}

// TODO also take user input of which sections to include
function generateAllMarkdowns(resumeJson, portfolioRepoPath) {
  const content_folder = portfolioRepoPath + "/content";
  if (resumeJson.basics) {
    const aboutMarkdown = generateAboutMarkdown(
      resumeJson.basics,
      resumeJson?.education
    );
    fs.writeFileSync(path.join(content_folder, "about.md"), aboutMarkdown);

    if (resumeJson.basics.contact) {
      const contactMarkdown = generateContactMarkdown(
        resumeJson.basics.contact
      );
      fs.writeFileSync(
        path.join(content_folder, "contact.md"),
        contactMarkdown
      );
    }
  }
  if (resumeJson.work) {
    const workMarkdown = generateWorkMarkdown(resumeJson.work);
    fs.writeFileSync(path.join(content_folder, "work.md"), workMarkdown);
  }
  // TODO repeat for other sections
}

export { generateAllMarkdowns };
