import { catchError } from "../../middleware/catchError.js";
import { labelModel } from "../../../database/models/label.model.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { userModel } from "../../../database/models/user.model.js";

const addLabel = catchError(async (req, res, next) => {
  req.body.user = req.user._id;
  let label = new labelModel(req.body);
  await label.save();

  let user = await userModel.findByIdAndUpdate(req.user._id, {
    $push: { labelsList: label._id },
  });

  res.json({ message: "success", label });
});

const updateLabel = catchError(async (req, res, next) => {
  let label = await labelModel.findOneAndUpdate(
    { user: req.user._id, _id: req.params.id },
    req.body,
    { new: true }
  );
  !label && res.status(404).json({ message: "label not found" });
  label && res.json({ message: "success", label });
});

const getAllLabels = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(
    labelModel.find({ user: req.user._id }),
    req.query
  )
    .fields()
    .filter()
    .pagination()
    .search()
    .sort();

  let labels = await apiFeatures.mongooseQuery;

  !labels && res.status(404).json({ message: "labels not found" });
  labels &&
    res.json({ message: "success", page: apiFeatures.pageNumber, labels });
});

const getSingleLabel = catchError(async (req, res, next) => {
  let label = await labelModel.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  !label && res.status(404).json({ message: "label not found" });
  label && res.json({ message: "success", label });
});

const deleteLabel = catchError(async (req, res, next) => {
  let label = await labelModel.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  let user = await userModel.findByIdAndUpdate(req.user._id, {
    $pull: { labelsList: req.params.id },
  });

  !label && res.status(404).json({ message: "label not found" });
  label && res.json({ message: "success", label });
});

export { addLabel, getAllLabels, getSingleLabel, deleteLabel, updateLabel };
