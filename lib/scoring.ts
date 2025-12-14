export function calculateRelevanceScore({
  volunteerSkills,
  taskSkills,
  distanceKm,
  deadline,
  priority,
}: {
  volunteerSkills: string[];
  taskSkills: string[];
  distanceKm: number;
  deadline: Date;
  priority: "Low" | "Medium" | "High";
}) {
  let score = 0;

  // 1️⃣ Skill Match (40)
  const matchedSkills = taskSkills.filter(skill =>
    volunteerSkills.includes(skill)
  );
  score += Math.min((matchedSkills.length / taskSkills.length) * 40, 40);

  // 2️⃣ Distance (25)
  if (distanceKm <= 5) score += 25;
  else if (distanceKm <= 10) score += 18;
  else if (distanceKm <= 20) score += 10;

  // 3️⃣ Deadline urgency (20)
  const daysLeft =
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);

  if (daysLeft <= 1) score += 20;
  else if (daysLeft <= 3) score += 15;
  else if (daysLeft <= 7) score += 8;

  // 4️⃣ Priority (15)
  if (priority === "High") score += 15;
  if (priority === "Medium") score += 10;
  if (priority === "Low") score += 5;

  return Math.round(score);
}
