import React, { useEffect, useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import dayjs from "dayjs";
import $ from "jquery";

const Analytics = (props) => {
  const {
    newClass,
    name,
    dayAnalyticsShow,
    titleShow,
    setStartDate,
    setEndDate,
    endDate,
    startDate,
    setMultiButtonSelect,
    multiButtonSelect,
    labelData,
  } = props;


  const [dayAnalytics, setDayAnalytics] = useState("all");

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setDayAnalytics(selectedValue);

    const currentDate = new Date();

    switch (selectedValue) {
      case "all":
        setStartDate("All");
        setEndDate("All");
        break;
      case "today":
        setStartDate(currentDate);
        setEndDate(currentDate);
        break;
      case "yesterday":
        const yesterdayDate = dayjs(currentDate).subtract(1, "day");
        setStartDate(yesterdayDate.isValid() ? yesterdayDate.toDate() : null);
        setEndDate(yesterdayDate.isValid() ? yesterdayDate.toDate() : null);
        break;
      case "week":
        const weekStartDate = dayjs(currentDate).startOf("week");
        const weekEndDate = dayjs(currentDate).endOf("week");
        setStartDate(weekStartDate.isValid() ? weekStartDate.toDate() : null);
        setEndDate(weekEndDate.isValid() ? weekEndDate.toDate() : null);
        break;
      case "month":
        const firstDayOfMonth = dayjs(currentDate).startOf("month");
        const lastDayOfMonth = dayjs(currentDate).endOf("month");
        setStartDate(
          firstDayOfMonth.isValid() ? firstDayOfMonth.toDate() : null
        );
        setEndDate(lastDayOfMonth.isValid() ? lastDayOfMonth.toDate() : null);
        break;
      case "year":
        const yearStartDate = dayjs(currentDate).startOf("year");
        const yearEndDate = dayjs(currentDate).endOf("year");
        setStartDate(yearStartDate.isValid() ? yearStartDate.toDate() : null);
        setEndDate(yearEndDate.isValid() ? yearEndDate.toDate() : null);
        break;
      default:
        setStartDate(null);
        setEndDate(null);
    }
  };

  const handleApply = (event, picker) => {
    const start = dayjs(picker.startDate).format("YYYY-MM-DD");
    const end = dayjs(picker.endDate).format("YYYY-MM-DD");
    setStartDate(start);
    setEndDate(end);
  };
  const [isDateRangePickerVisible, setDateRangePickerVisible] = useState(false);

  const [state, setState] = useState({
    start: dayjs().subtract(29, "days"),
    end: dayjs(),
  });
  const { start, end } = state;

  const handleCancel = (event, picker) => {
    picker?.element.val("");
    setStartDate("");
    setEndDate("");
  };

  const handleCallback = (start, end) => {
    setState({ start, end });
  };
  const label = start.format("DD/MM/YYYY") + " - " + end.format("DD/MM/YYYY");

  const { color, bgColor } = props;

  const startAllDate = "1970-01-01";
  const endAllDate = dayjs().format("YYYY-MM-DD");
  const handleInputClick = () => {
    setDateRangePickerVisible(!isDateRangePickerVisible);
  }
  $(document).ready(function () {
    $("data-range-key").removeClass("active");
    $("[data-range-key='All']").addClass("active");
  });



  return (
    <div className="date-range-box">
      <DateRangePicker
        initialSettings={{
          startDate: undefined,
          endDate: undefined,
          ranges: {
            All: [new Date("1970-01-01"), dayjs().toDate()],
            Today: [dayjs().toDate(), dayjs().toDate()],
            Yesterday: [
              dayjs().subtract(1, "days").toDate(),
              dayjs().subtract(1, "days").toDate(),
            ],

            "Last 7 Days": [
              dayjs().subtract(6, "days").toDate(),
              dayjs().toDate(),
            ],
            "Last 30 Days": [
              dayjs().subtract(29, "days").toDate(),
              dayjs().toDate(),
            ],
            "This Month": [
              dayjs().startOf("month").toDate(),
              dayjs().endOf("month").toDate(),
            ],
            "Last Month": [
              dayjs()
                .subtract(1, "month")
                .startOf("month")
                .toDate(),
              dayjs().subtract(1, "month").endOf("month").toDate(),
            ],
            // "Reset Dates": [new Date("1970-01-01"), dayjs().toDate()],
          },
          maxDate: new Date(),
        }}
        onCallback={handleCallback}
        onApply={handleApply}
      >
        <input
          type="text"
          bgColor={bgColor}
          color={color}
          readOnly
          placeholder="Select Date Range"
          onClick={handleInputClick}
          className={`daterange float-right  mr-4  text-center ${bgColor} ${color}`}
          value={
            (startDate === startAllDate &&
              endDate === endAllDate) ||
              (startDate === "All" && endDate === "All")
              ? "Select Date Range"
              : dayjs(startDate).format("MM/DD/YYYY") &&
                dayjs(endDate).format("MM/DD/YYYY")
                ? `${dayjs(startDate).format("MM/DD/YYYY")} - ${dayjs(
                  endDate
                ).format("MM/DD/YYYY")}`
                : "Select Date Range"
          }
          style={{
            // width: "85%",
            fontWeight: 500,
            cursor: "pointer",
            background: "white",
            color: "rgba(0, 0, 0, 0.87)",
            display: "flex",
            width: "100%",
            justifyContent: "end",
            fontSize: "13px",
            padding: "10px",
            maxWidth: "226px",
            borderRadius: "64px",
            border: "1px solid #FF4D67",
            height: "48px !important",
          }}
        />
      </DateRangePicker>
      <div className="right-drp-btn">Analytics</div>
    </div>
  );
};

export default Analytics;
