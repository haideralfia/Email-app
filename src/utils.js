export const truncate = (str, n) => {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
};

export const getDateString = (time) => {
  // required => dd/MM/yyyy hh:mm a

  const short_time = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
    dateStyle: "short"
  });

  let received_time = short_time?.format(time); // d/MM/yyyy hh:mm a

  // now convert d/MM/yyyy hh:mm a => dd/MM/yyyy hh:mm a
  let split_time = received_time?.split("/");

  if (parseInt(split_time[0]) >= 10) return received_time;
  else {
    return "0" + received_time;
  }
};
