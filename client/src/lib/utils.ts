import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function setupCornerClickEasterEgg(
  callback: () => void,
  cornerSize = 50
): () => void {

  let cornerClicks = 0;
  const sequence = ["topLeft", "topRight", "bottomRight", "bottomLeft"];

  const handleClick = (e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let corner = "";

    // Check if click is in one of the corners
    if (x < cornerSize && y < cornerSize) {
      corner = "topLeft";
    } else if (x > windowWidth - cornerSize && y < cornerSize) {
      corner = "topRight";
    } else if (x > windowWidth - cornerSize && y > windowHeight - cornerSize) {
      corner = "bottomRight";
    } else if (x < cornerSize && y > windowHeight - cornerSize) {
      corner = "bottomLeft";
    }

    // If corner was clicked and it's the expected next corner
    if (corner && corner === sequence[cornerClicks]) {
      cornerClicks++;

      // If the full sequence is entered, show the easter egg
      if (cornerClicks === sequence.length) {
        callback();
        cornerClicks = 0;
      }
    } else if (corner) {
      // If wrong corner was clicked, reset
      cornerClicks = corner === sequence[0] ? 1 : 0;
    }
  };

  window.addEventListener("click", handleClick);

  // Return cleanup function
  return () => window.removeEventListener("click", handleClick);
}