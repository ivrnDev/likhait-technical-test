/**
 * Form component for adding/editing categories
 */

import React, { useState } from "react";
import { CategoryFormData } from "../types";
import { TextField, Button } from "../vibes";
import { useCategoryForm } from "../hooks/useCategoryForm";
import EmojiPicker from "emoji-picker-react";
import { COLORS } from "../constants/colors";

interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Add Category",
}: CategoryFormProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { formData, errors, isSubmitting, handleChange, handleSubmit } =
    useCategoryForm({
      initialData,
      onSubmit,
    });

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const emojiPreviewStyle: React.CSSProperties = {
    width: "100%",
    minHeight: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    padding: "0 20px",
    border: "1px solid #e5e7eb",
    borderRadius: "0.5rem",
    backgroundColor: "#f9fafb",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  const emojiPickerContainerStyle: React.CSSProperties = {
    width: "100%",
    height: "435px",
  };

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    marginTop: "0.5rem",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <TextField
        label="Name"
        type="text"
        placeholder="Enter category name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={errors.name}
        fullWidth
        required
      />

      <div>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: 500,
          }}
        >
          Emoji
        </label>

        <div
          role="button"
          tabIndex={0}
          aria-label="Select emoji"
          style={emojiPreviewStyle}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setShowEmojiPicker((prev) => !prev);
            }
          }}
        >
          <span style={{ fontSize: "2.5rem" }}>{formData.emoji || "🙂"}</span>

          <span
            style={{
              marginLeft: "0.75rem",
              color: COLORS.text.secondary,
              fontSize: "0.9rem",
            }}
          >
            {formData.emoji ? "Selected emoji" : "Select an emoji"}
          </span>
        </div>

        {errors.emoji && (
          <div
            style={{
              marginTop: "0.25rem",
              fontSize: "0.875rem",
              color: "#dc2626",
            }}
          >
            {errors.emoji}
          </div>
        )}
      </div>

      {showEmojiPicker && (
        <div style={emojiPickerContainerStyle}>
          <EmojiPicker
            width="100%"
            height="100%"
            onEmojiClick={(emojiData) => {
              handleChange("emoji", emojiData.emoji);
              setShowEmojiPicker(false);
            }}
          />
        </div>
      )}

      <div style={buttonGroupStyle}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          fullWidth
        >
          {isSubmitting ? "Submitting..." : submitLabel}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
