import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import roomModel from "../models/room.model.js";
import { sendResponse } from "../middlewares/sendResponse.js";
export const createRoom = catchAsyncErrors(async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return sendResponse(res, {
      status: 400,
      message: "Please enter a room code",
    });
  };
  const room = await roomModel.create({
    code
  });
  return sendResponse(res, {
    status: 200,
    message: "Room created",
    data: room,
  });
}
)
export const getRooms = catchAsyncErrors(async (req, res) => {
  const rooms = await roomModel.find();
  return sendResponse(res, {
    status: 200,
    data: rooms,
  });
});
export const getRoomByID = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const room = await roomModel.findById(id);
  if (!room) {
    return sendResponse(res, {
      status: 404,
      message: "Room not found",
    });
  }
  return sendResponse(res, {
    status: 200,
    data: room,
  })
}
);
export const deleteRoom = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const room = await roomModel.findByIdAndDelete(id);
  if (!room) {
    return sendResponse(res, {
      status: 404,
      message: "Room not found",
    });
  }
  return sendResponse(res, {
    status: 200,
    message: "Room deleted",
  });
}
);