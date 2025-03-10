import moment from "moment";

export const formatNumberToCurrency = (price: number) => {
  if (isNaN(price)) {
    return "-";
  }
  return new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "NGN",
  }).format(price);
};

export const relativeTime = (time: string) => {
  moment.updateLocale("en", {
    relativeTime: {
      future: "in %s",
      past: "%s ago",
      s: function (number) {
        return (number < 10 ? "0" : "") + number + " minutes";
      },
      m: "01:00 minutes",
      mm: function (number) {
        return (number < 10 ? "0" : "") + number + " minutes";
      },
      h: "an hour",
      hh: "%d hours",
      d: "a day",
      dd: "%d days",
      M: "a month",
      MM: "%d months",
      y: "a year",
      yy: "%d years",
    },
  });

  return moment(time).fromNow();
};
