import { JSerStat } from "@jser/stat";
import { fetchItems, fetchPosts } from "@jser/data-fetcher";
import dayjs from "dayjs";
import * as fs from "fs";

(async function () {
    const [items, posts] = await Promise.all([fetchItems(), fetchPosts()]);
    const stat = new JSerStat(items, posts);
    const startDay = dayjs("2020-12-24", "YYYY-MM-DD");
    const enDay = dayjs("2021-01-07", "YYYY-MM-DD");
    const totalItems = [];
    for (let i = 0; i < 10; i++) {
        const weeks = stat.findJSerWeeksBetween(
            startDay.subtract(i, "year").toDate(),
            enDay.subtract(i, "year").toDate()
        );
        const releaseItems = weeks.flatMap((week) => {
            return week.items.filter((item) => item.tags.some((tag) => tag.toLocaleLowerCase() === "releasenote"));
        });
        totalItems.push(...releaseItems);
    }
    console.log(totalItems);
    fs.writeFileSync("result.txt", totalItems.map((item) => dayjs(item.date).format("YYYY-MM-DD")).join("\n"), "utf-8");
})();
