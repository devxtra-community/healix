export class PricingController {
    pricingservice;
    constructor(pricingservice) {
        this.pricingservice = pricingservice;
    }
    setBasePrice = async (req, res, next) => {
        try {
            const { productId, price } = req.body;
            const result = await this.pricingservice.setBasePrice(productId, price);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    createDiscount = async (req, res, next) => {
        try {
            const discount = await this.pricingservice.createDiscount(req.body);
            res.status(201).json(discount);
        }
        catch (error) {
            next(error);
        }
    };
    getActivePrice = async (req, res, next) => {
        try {
            const { productId } = req.params;
            const price = await this.pricingservice.getActivePrice(productId);
            res.status(200).json(price);
        }
        catch (error) {
            next(error);
        }
    };
    applyDiscount = async (req, res, next) => {
        try {
            const { productId, couponCode, orderAmount } = req.body;
            const result = await this.pricingservice.applyDiscount(productId, couponCode, orderAmount);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    };
    getAllDiscounts = async (req, res, next) => {
        try {
            const discounts = await this.pricingservice.getAllDiscounts();
            res.status(200).json(discounts);
        }
        catch (error) {
            next(error);
        }
    };
    getDiscountById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const discount = await this.pricingservice.getDiscountById(id);
            res.status(200).json(discount);
        }
        catch (error) {
            next(error);
        }
    };
    updateDiscount = async (req, res, next) => {
        try {
            const { id } = req.params;
            const updated = await this.pricingservice.updateDiscount(id, req.body);
            res.status(200).json(updated);
        }
        catch (error) {
            next(error);
        }
    };
    deleteDiscount = async (req, res, next) => {
        try {
            const { id } = req.params;
            const deleted = await this.pricingservice.deleteDiscount(id);
            res.status(200).json({
                message: 'Discount deleted successfully',
                deleted,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
