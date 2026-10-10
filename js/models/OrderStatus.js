

  var OrderStatus = Object.freeze({
    DRAFT: "draft",
    SCHEDULED: "scheduled",
    SEARCHING: "searching",
    DRIVER_ASSIGNED: "driver_assigned",
    DRIVER_ARRIVED: "driver_arrived",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
  });
  var S = OrderStatus;
  var ORDER_TRANSITIONS = Object.freeze({
    [S.DRAFT]: [S.SEARCHING, S.SCHEDULED],
    [S.SCHEDULED]: [S.SEARCHING, S.CANCELLED],
    [S.SEARCHING]: [S.DRIVER_ASSIGNED, S.CANCELLED],
    [S.DRIVER_ASSIGNED]: [S.DRIVER_ARRIVED, S.CANCELLED],
    [S.DRIVER_ARRIVED]: [S.IN_PROGRESS, S.CANCELLED],
    [S.IN_PROGRESS]: [S.COMPLETED],
    [S.COMPLETED]: [],
    [S.CANCELLED]: []
  });
  var STATUS_LABELS = Object.freeze({
    [S.DRAFT]: "\u0427\u0435\u0440\u043D\u0435\u0442\u043A\u0430",
    [S.SCHEDULED]: "\u0417\u0430\u043F\u043B\u0430\u043D\u043E\u0432\u0430\u043D\u0435",
    [S.SEARCHING]: "\u041F\u043E\u0448\u0443\u043A \u0432\u043E\u0434\u0456\u044F",
    [S.DRIVER_ASSIGNED]: "\u0412\u043E\u0434\u0456\u0439 \u043F\u0440\u0438\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0439",
    [S.DRIVER_ARRIVED]: "\u0412\u043E\u0434\u0456\u0439 \u043D\u0430 \u043C\u0456\u0441\u0446\u0456",
    [S.IN_PROGRESS]: "\u0423 \u0434\u043E\u0440\u043E\u0437\u0456",
    [S.COMPLETED]: "\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0435",
    [S.CANCELLED]: "\u0421\u043A\u0430\u0441\u043E\u0432\u0430\u043D\u0435"
  });
  function canTransition(from, to) {
    return ORDER_TRANSITIONS[from]?.includes(to) ?? false;
  }

export { OrderStatus, S, ORDER_TRANSITIONS, STATUS_LABELS, canTransition };
