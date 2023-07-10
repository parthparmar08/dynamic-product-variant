import React, { useState, useEffect } from "react";
import "../App.css";

const DynamicProductVariant = () => {
  const [variants, setVariants] = useState([
    { options: [""], subOptions: [[""]] },
  ]);
  const [showTable, setShowTable] = useState(false);
  const [allVariants, setAllVariants] = useState([]);
  const [productTitle, setProductTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    handleSubmit();
  }, [variants]);

  const handleAddVariant = () => {
    const newVariant = {
      options: [""],
      subOptions: [[""]],
    };
    setVariants([...variants, newVariant]);
  };

  const handleAddSubOption = (variantIndex, optionIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].subOptions[optionIndex].push("");
    setVariants(updatedVariants);
  };

  const handleOptionChange = (variantIndex, optionIndex, event) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].options[optionIndex] = event.target.value;
    setVariants(updatedVariants);
  };

  const handleSubOptionChange = (
    variantIndex,
    optionIndex,
    subOptionIndex,
    event
  ) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].subOptions[optionIndex][subOptionIndex] =
      event.target.value;
    setVariants(updatedVariants);
  };

  const handleRemoveVariant = (variantIndex) => {
    const updatedVariants = variants.filter(
      (_, index) => index !== variantIndex
    );
    setVariants(updatedVariants);
  };

  const handleRemoveSubOption = (variantIndex, optionIndex, subOptionIndex) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].subOptions[optionIndex].splice(
      subOptionIndex,
      1
    );
    setVariants(updatedVariants);
  };

  const handleSubmit = () => {
    const generatedVariants = [];

    const generateVariants = (
      options,
      subOptions,
      variantIndex,
      combination = ""
    ) => {
      if (variantIndex === options.length) {
        generatedVariants.push(combination.trim());
        return;
      }

      const currentSubOptions = subOptions[variantIndex];

      for (let i = 0; i < currentSubOptions.length; i++) {
        generateVariants(
          options,
          subOptions,
          variantIndex + 1,
          `${combination}${currentSubOptions[i]}\n`
        );
      }
    };

    const options = variants.map((variant) => variant.options).flat();
    const subOptions = variants.map((variant) => variant.subOptions).flat();

    generateVariants(options, subOptions, 0);

    setAllVariants(generatedVariants);
    setShowTable(true);
  };

  const handleFormSubmit = () => {
    const products = allVariants.map((variant) => ({
      productTitle,
      description,
      variant,
      price: "",
      quantity: 0,
    }));

    console.log(products);
  };

  return (
    <div className="container">
      <div>
        <label htmlFor="productTitle" className="form-label">
          Product Title:
        </label>
        <input
          type="text"
          id="productTitle"
          value={productTitle}
          onChange={(event) => setProductTitle(event.target.value)}
          className="form-input"
          placeholder="Enter a Product Title"
        />
      </div>
      <div>
        <label htmlFor="description" className="form-label">
          Description:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="form-textarea"
          placeholder="Enter a Product Description"
        ></textarea>
      </div>
      {variants.map((variant, variantIndex) => (
        <div key={variantIndex} className="variant-container">
          <div className="variant-heading-container">
            <h3 className="variant-heading">Variant {variantIndex + 1}</h3>
            {variantIndex > 0 && (
              <button
                onClick={() => handleRemoveVariant(variantIndex)}
                className="remove-variant-btn"
              >
                ✖
              </button>
            )}
          </div>
          {variant.options.map((option, optionIndex) => (
            <div key={optionIndex} className="option-container">
              <div className="option-label-container">
                <label
                  htmlFor={`option-${variantIndex}-${optionIndex}`}
                  className="form-label"
                >
                  Option:
                </label>{" "}
                &nbsp;
                <input
                  type="text"
                  id={`option-${variantIndex}-${optionIndex}`}
                  value={option}
                  onChange={(event) =>
                    handleOptionChange(variantIndex, optionIndex, event)
                  }
                  className="form-input"
                  placeholder="Enter an Option (Ex. Size, Color, etc.)"
                />
              </div>

              {variant.subOptions[optionIndex].map(
                (subOption, subOptionIndex) => (
                  <div key={subOptionIndex} className="sub-option-container">
                    <label
                      htmlFor={`subOption-${variantIndex}-${optionIndex}-${subOptionIndex}`}
                      className="form-label"
                    >
                      Sub Option:
                    </label>

                    <input
                      type="text"
                      id={`subOption-${variantIndex}-${optionIndex}-${subOptionIndex}`}
                      value={subOption}
                      onChange={(event) =>
                        handleSubOptionChange(
                          variantIndex,
                          optionIndex,
                          subOptionIndex,
                          event
                        )
                      }
                      className="form-input"
                      placeholder="Enter a Sub Option (Ex. Small, Black, etc.)"
                    /> &nbsp;
                    {subOptionIndex > 0 && (
                      <button
                        onClick={() =>
                          handleRemoveSubOption(
                            variantIndex,
                            optionIndex,
                            subOptionIndex
                          )
                        }
                        className="remove-variant-btn"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                )
              )}
              <button
                onClick={() => handleAddSubOption(variantIndex, optionIndex)}
                className="suboption-btn"
              >
                Add Sub Option
              </button>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleAddVariant} className="add-variant-btn">
        Add Variant
      </button> &nbsp;
      {showTable && (
        <div className="preview-container">
          <h3 className="preview-title">Preview</h3>
          <table className="preview-table">
            <thead>
              <tr>
                <th>Variant</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {allVariants.map((variant, variantIndex) => (
                <tr key={variantIndex}>
                  <td>{variant}</td>
                  <td>
                    <input type="text" className="input-price" />
                  </td>
                  <td>
                    <input type="number" className="input-price" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={handleFormSubmit} className="submit-btn">
        Submit
      </button>
    </div>
  );
};

export default DynamicProductVariant;
