import nlp from "compromise";
import datesPlugin from "compromise-dates";
import { format } from "path";

nlp.extend(datesPlugin);

export function findPlaces(input: string): Array<string> {
  const doc = nlp(input);
  const places = doc.places();
  return places.out("array");
}

export function findDates(input: string): Array<string> | null {
  const doc: any = nlp(input);
  const dates = doc.dates().json();

  let fromattedDates: Array<string> = [];

  for (let i = 0; i < dates.length; i++) {
    const date = new Date(dates[i].dates.start).toISOString().split("T")[0];
    fromattedDates.push(date);
  }

  return fromattedDates;
}
