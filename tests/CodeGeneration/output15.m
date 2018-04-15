factorial		 % Function Definition
		 sw	 -40(r14), r15	 % Save Link
		 lw	 r3, -8(r14)
		 sw	  -8(r14), r3
		 addi	 r3, r0, 0
		 sw	 -12(r14),  r3
		 lw	 r3, -8(r14)
		 lw	 r4, -12(r14)
		 ceq	 r5,r3,r4
		 sw	 -16(r14), r5
		 lw	 r3, -16(r14)
		 bz	 r3, else_1
		 addi	 r3, r0, 1
		 sw	 -20(r14),  r3
		 lw	 r13, -20(r14)
		 lw	 r15, -40(r14)	 % Restore Link
		 jr r15
		 j	 endif_1
		 else_1 nop
		 addi	 r3, r0, 1
		 sw	 -24(r14),  r3
		 lw	 r3, -8(r14)
		 lw	 r4, -24(r14)
		 sub	 r5,r3,r4
		 sw	 -28(r14), r5
		 lw	 r3, -28(r14)
		 sw	 -48(r14), r3
		 subi	 r14, r14, 40	 % Adjust SP
		 jl	 r15, factorial
		 addi	 r14, r14, 40	 % Adjust SP
		 sw	 -32(r14), r13
		 lw	 r3, -8(r14)
		 lw	 r4, -32(r14)
		 mul	 r5,r3,r4
		 sw	 -36(r14), r5
		 lw	 r13, -36(r14)
		 lw	 r15, -40(r14)	 % Restore Link
		 jr r15
		 endif_1 nop
number		 % Function Definition
		 sw	 -12(r14), r15	 % Save Link
		 addi	 r3, r0, 5
		 sw	 -8(r14),  r3
		 lw	 r3, -8(r14)
		 sw	 -4(r14),  r3
		 lw	 r13, -4(r14)
		 lw	 r15, -12(r14)	 % Restore Link
		 jr r15
addNumbers		 % Function Definition
		 sw	 -32(r14), r15	 % Save Link
		 lw	 r3, -8(r14)
		 sw	  -8(r14), r3
		 lw	 r3, -12(r14)
		 sw	  -12(r14), r3
		 lw	 r3, -16(r14)
		 sw	  -16(r14), r3
		 lw	 r3, -8(r14)
		 lw	 r4, -12(r14)
		 add	 r5,r3,r4
		 sw	 -24(r14), r5
		 lw	 r3, -24(r14)
		 lw	 r4, -16(r14)
		 add	 r5,r3,r4
		 sw	 -28(r14), r5
		 lw	 r3, -28(r14)
		 sw	 -20(r14),  r3
		 lw	 r13, -20(r14)
		 lw	 r15, -32(r14)	 % Restore Link
		 jr r15
entry % Program start
		 addi	 r14, r0, topaddr  % Set stack pointer
		 addi	 r3, r0, 6
		 sw	 -8(r14),  r3
		 lw	 r3, -8(r14)
		 sw	 -56(r14), r3
		 subi	 r14, r14, 48	 % Adjust SP
		 jl	 r15, factorial
		 addi	 r14, r14, 48	 % Adjust SP
		 sw	 -12(r14), r13
		 addi	 r3, r0, 300
		 sw	 -16(r14),  r3
		 lw	 r3, -12(r14)
		 lw	 r4, -16(r14)
		 sub	 r5,r3,r4
		 sw	 -20(r14), r5
		 subi	 r14, r14, 48	 % Adjust SP
		 jl	 r15, number
		 addi	 r14, r14, 48	 % Adjust SP
		 sw	 -24(r14), r13
		 lw	 r3, -20(r14)
		 lw	 r4, -24(r14)
		 add	 r5,r3,r4
		 sw	 -28(r14), r5
		 addi	 r3, r0, 1
		 sw	 -32(r14),  r3
		 lw	 r3, -32(r14)
		 sw	 -56(r14), r3
		 addi	 r3, r0, 2
		 sw	 -36(r14),  r3
		 lw	 r3, -36(r14)
		 sw	 -60(r14), r3
		 addi	 r3, r0, 3
		 sw	 -40(r14),  r3
		 lw	 r3, -40(r14)
		 sw	 -64(r14), r3
		 subi	 r14, r14, 48	 % Adjust SP
		 jl	 r15, addNumbers
		 addi	 r14, r14, 48	 % Adjust SP
		 sw	 -44(r14), r13
		 lw	 r3, -28(r14)
		 lw	 r4, -44(r14)
		 add	 r5,r3,r4
		 sw	 -48(r14), r5
		 lw	 r3, -48(r14)
		 sw	 -4(r14),  r3
		 lw	 r3, -4(r14)
		 sw	 -8(r14), r3
		 addi	 r4,r0,buf
		 sw	 -12(r14), r4
		 jl	 r15, intstr
		 sw	 -8(r14), r13
		 jl	 r15, putstr
		 hlt
buf	res	20
