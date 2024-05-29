import Product from "../modules/ProductModule.js";
import Users from "../modules/UserModule.js";
import { Op } from 'sequelize';

export const getProducts = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Product.findAll({
        attributes: ['uuid', 'name', 'price'],
        include: [
          {
            model: Users,
            attributes:['name', 'email']
          },
        ],
      });
    } else {
      // if (req.userId === undefined || req.userId === null) {
      //   return res.status(400).json({ msg: "Invalid userId value" });
      // }
      response = await Product.findAll({
        attributes:['uuid', 'name', 'price'],
        where: {
          userId: req.userId
        },
        include: [
          {
            model: Users,
            attributes:['name', 'email']
          },
        ],
      });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductsId = async(req, res) => {
  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id
      }
    });
    if (!product) return res.status(404).json({
      msg:"Product not found!"
    })
    let response;
    if (req.role === "admin") {
      response = await Product.findOne({
        attributes: ['uuid', 'name', 'price'],
        where: {
          id: product.id,
        },
        include: [
          {
            model: Users,
            attributes:['name', 'email']
          },
        ],
      });
    } else {
      // if (req.userId === undefined || req.userId === null) {
      //   return res.status(400).json({ msg: "Invalid userId value" });
      // }
      response = await Product.findOne({
        attributes:['uuid', 'name', 'price'],
        where: {
          [Op.and]:[{id:product.id}, {userId:req.userId}],
          userId: req.userId
        },
        include: [
          {
            model: Users,
            attributes:['name', 'email']
          },
        ],
      });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    await Product.create({
      name: name,
      price: price,
      userId: req.userId,
    });
    res.status(201).json({
      msg: "Product created successfully!",
    });
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};
export const updateProducts = async(req, res) => {
    try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id
      }
    });
    if (!product) return res.status(404).json({
      msg:"Product not found!"
    })
    const { name, price } = req.body;
    if (req.role === "admin") {
      await Product.update({ name, price }, {
        where: {
          id:product.id,
        }
      });
    } else {
      if(req.userId !== product.userId) return res.status(403).json({msg:"User is Unauthorized"})
      await Product.update(
        { name, price },
        {
          where: {
            [Op.and]:[{id: product.id}, {userId:req.userId}]
          },
        }
      );
      }
    res.status(200).json({msg:"Product updated successfully!"});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};



export const deleteProducts = async(req, res) => {

  try {
    const product = await Product.findOne({
      where: {
        uuid: req.params.id
      }
    });
    if (!product) return res.status(404).json({ msg: "Unable to delete, User Not found!" }) 
    if (req.role == "admin") {
      await Product.destroy({
        where: {
          id: userId
        }
      });
    } else {
      if (req.userId !== product.userId) return res.status(403).json({ msg: "User is not authorized" })
      await Product.destroy({
        where: {
          [Op.and]: [{ id: product.id }, { userId: req.userId }],
        },
      });
  }
res.status(200).json({msg:"User deleted successfully!"})
  } catch (error) {
    res.status(500).json({ msg: error.message });
    
  }
};
