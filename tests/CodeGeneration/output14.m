factorial		 % Function Definition
		 sw	 -4(r14), r15	 % Save Link
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
		 lw	 r15, -4(r14)	 % Restore Link
		 jr r15
		 j	 endif_1
		 else_1 nop
		 addi	 r3, r0, 1
		 sw	 -24(r14),  r3
		 lw	 r3, -8(r14)
		 lw	 r4, -24(r14)
		 sub	 r5,r3,r4
		 sw	 -28(r14), r5
		 subi	 r14, r14, 20	 % Adjust SP
		 jl	 r15, factorial
		 addi	 r14, r14, 20	 % Adjust SP
		 sw	 -32(r14), r13
		 lw	 r3, -8(r14)
		 lw	 r4, -32(r14)
		 mul	 r5,r3,r4
		 sw	 -36(r14), r5
		 lw	 r13, -36(r14)
		 lw	 r15, -4(r14)	 % Restore Link
		 jr r15
		 endif_1 nop
entry % Program start
		 addi	 r14, r0, topaddr  % Set stack pointer
		 addi	 r3, r0, 6
		 sw	 -8(r14),  r3
		 subi	 r14, r14, 0	 % Adjust SP
		 jl	 r15, factorial
		 addi	 r14, r14, 0	 % Adjust SP
		 sw	 -12(r14), r13
		 addi	 r3, r0, 300
		 sw	 -16(r14),  r3
		 lw	 r3, -12(r14)
		 lw	 r4, -16(r14)
		 sub	 r5,r3,r4
		 sw	 -20(r14), r5
		 lw	 r3, -20(r14)
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
