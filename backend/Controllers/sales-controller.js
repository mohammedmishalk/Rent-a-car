const getSalesReport = async (req, res) => {
    try {
      const today = moment().startOf('day');
      const endtoday = moment().endOf('day');
      const monthstart = moment().startOf('month');
      const monthend = moment().endOf('month');
      const yearstart = moment().startOf('year');
      const yearend = moment().endOf('year');
      const daliyReport = await Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: today.toDate(),
              $lte: endtoday.toDate(),
            },
          },
        },
        {
          $lookup:
                {
                  from: 'User',
                  localField: 'user_id',
                  foreignField: '_id',
                  as: 'user',
                },
        },
  
        {
          $project: {
            order_id: 1,
            user_id: 1,
            dropped: 1,
            totalAmount: 1,
            orderStatus: 1,
            createdAt:1
          },
        },
       
      ]);
      // console.log("dataaaaaaaaaaaaaaaaaaaaa")/
      // console.log(daliyReport);
      const monthReport = await Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: monthstart.toDate(),
              $lte: monthend.toDate(),
            },
          },
        },
        {
          $lookup:
                {
                  from: 'User',
                  localField: 'user_id',
                  foreignField: '_id',
                  as: 'user',
                },
        },
  
        {
          $project: {
            order_id: 1,
            user_id: 1,
            dropped: 1,
            totalAmount: 1,
            orderStatus: 1,
            createdAt:1

          },
        },
        
      ]);
      const yearReport = await Booking.aggregate([
        {
          $match: {
            createdAt: {
              $gte: yearstart.toDate(),
              $lte: yearend.toDate(),
            },
          },
        },
        {
          $lookup:
                {
                  from: 'User',
                  localField: 'user_id',
                  foreignField: '_id',
                  as: 'user',
                },
        },
        {
          $project: {
            order_id: 1,
            user_id: 1,
            dropped: 1,
            totalAmount: 1,
            orderStatus: 1,
            createdAt:1
          },
        },
        
      ]);
      res.send({ today: daliyReport, month: monthReport, year: yearReport });
    } catch (error) {
      res.send({massage:"no data"});
    }
  };