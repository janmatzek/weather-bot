import nlp from "compromise";
import datesPlugin from "compromise-dates";

nlp.extend(datesPlugin);

export function findPlaces(input: string): Array<string> {
  const doc = nlp(input);
  const places = doc.places();
  return places.out("array");
}

//TODO: figure out why the returned date is date - 1 for dates like November 4th
export function findDates(input: string): Array<string> {
  const doc: any = nlp(input);
  const dates = doc.dates().json();
  let fromattedDates: Array<string> = [];

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i].dates.start.split("T")[0];
    fromattedDates.push(date);
  }

  return fromattedDates;
}
