const getAllbooking = async (req, res) => {
    try {
      const found = await Booking.find();
      res.send({ success: true, found, cancel:found.cancel });
    } catch (error) {
      res.send({ success: false, message: error.message });
    }
  };

  const Refunde = async (req, res) => {
    try {
      const { id } = req.params;
      const found = await Booking.findById(id);
  
      if (!found) {
        return res.status(404).send({ success: false, message: "Booking not found." });
      }
  
      if (!found.cancel) {
        return res.status(400).send({ success: false, message: "Booking cannot be refunded." });
      }
  
      const user = await User.findById(found.user_id);
  
      if (!user) {
        return res.status(404).send({ success: false, message: "User not found." });
      }
  
      const value = found.totalAmount;
      await Booking.updateOne({ _id: id }, { $set: { cancel: "Refuned" } });
      await User.updateOne({ _id: user._id }, { $inc: { walletBalance: value } });
  
      found.refund = true;
      await found.save();
  
      res.send({ success: true, message: "Refund successful." });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, message: "Internal server error." });
    }
  };