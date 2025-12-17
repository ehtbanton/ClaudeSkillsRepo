import 'package:flutter/material.dart';

enum ButtonVariant { primary, secondary, outline, ghost }
enum ButtonSize { sm, md, lg }

class CustomButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final ButtonVariant variant;
  final ButtonSize size;
  final bool isLoading;
  final bool isDisabled;
  final IconData? leftIcon;
  final IconData? rightIcon;

  const CustomButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = ButtonVariant.primary,
    this.size = ButtonSize.md,
    this.isLoading = false,
    this.isDisabled = false,
    this.leftIcon,
    this.rightIcon,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: _getHeight(),
      child: ElevatedButton(
        onPressed: (isDisabled || isLoading) ? null : onPressed,
        style: _getButtonStyle(),
        child: isLoading
            ? SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: _getTextColor(),
                ),
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (leftIcon != null) ...[
                    Icon(leftIcon, size: _getIconSize()),
                    const SizedBox(width: 8),
                  ],
                  Text(label, style: TextStyle(fontSize: _getFontSize())),
                  if (rightIcon != null) ...[
                    const SizedBox(width: 8),
                    Icon(rightIcon, size: _getIconSize()),
                  ],
                ],
              ),
      ),
    );
  }

  double _getHeight() => switch (size) {
    ButtonSize.sm => 36,
    ButtonSize.md => 44,
    ButtonSize.lg => 52,
  };

  double _getFontSize() => switch (size) {
    ButtonSize.sm => 14,
    ButtonSize.md => 16,
    ButtonSize.lg => 18,
  };

  double _getIconSize() => switch (size) {
    ButtonSize.sm => 16,
    ButtonSize.md => 20,
    ButtonSize.lg => 24,
  };

  Color _getTextColor() => switch (variant) {
    ButtonVariant.primary => Colors.white,
    ButtonVariant.secondary => Colors.white,
    ButtonVariant.outline => const Color(0xFF3B82F6),
    ButtonVariant.ghost => const Color(0xFF3B82F6),
  };

  ButtonStyle _getButtonStyle() => switch (variant) {
    ButtonVariant.primary => ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF3B82F6),
        foregroundColor: Colors.white,
      ),
    ButtonVariant.secondary => ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF64748B),
        foregroundColor: Colors.white,
      ),
    ButtonVariant.outline => ElevatedButton.styleFrom(
        backgroundColor: Colors.transparent,
        foregroundColor: const Color(0xFF3B82F6),
        side: const BorderSide(color: Color(0xFF3B82F6)),
      ),
    ButtonVariant.ghost => ElevatedButton.styleFrom(
        backgroundColor: Colors.transparent,
        foregroundColor: const Color(0xFF3B82F6),
        elevation: 0,
      ),
  };
}
