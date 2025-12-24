import Joi from "joi";
export const ListingSchema=Joi.object({
    listing:Joi.object({
       title:Joi.string().required(),
       description:Joi.string().required(),
       price:Joi.number().required().min(0),
       location:Joi.string().required(),
       country:Joi.string().required(),
       image: Joi.object({
       filename: Joi.string().allow("", null),
       url: Joi.string().uri().allow("", null)
       }).optional()

    }).required()
});
export const ReviewSchema=Joi.object({
    review:Joi.object({
        comment:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5)
    }).required()
});