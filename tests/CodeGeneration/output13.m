entry % Program start
		 addi	 r1, r0, topaddr  % Set frame pointer
		 addi	 r2, r0, topaddr  % Set stack pointer
		 addi	 r14, r0, topaddr  % Set func stack pointer
		 addi	 r3, r0, 15
		 sw	 -8(r2),  r3
		 lw	 r3, -8(r2)
		 sw	 -4(r2),  r3
		 addi	 r3, r0, 15
		 sw	 -12(r2),  r3
		 lw	 r3, -4(r2)
		 lw	 r4, -12(r2)
		 ceq	 r5,r3,r4
		 sw	 -16(r2), r5
		 lw	 r3, -16(r2)
		 bz	 r3, else_1
		 addi	 r3, r0, 1
		 sw	 -20(r2),  r3
		 lw	 r3, -4(r2)
		 lw	 r4, -20(r2)
		 add	 r5,r3,r4
		 sw	 -24(r2), r5
		 lw	 r3, -24(r2)
		 sw	 -4(r2),  r3
		 addi	 r3, r0, 15
		 sw	 -28(r2),  r3
		 lw	 r3, -4(r2)
		 lw	 r4, -28(r2)
		 cge	 r5,r3,r4
		 sw	 -32(r2), r5
		 lw	 r3, -32(r2)
		 bz	 r3, else_2
		 addi	 r3, r0, 10
		 sw	 -36(r2),  r3
		 lw	 r3, -36(r2)
		 sw	 -4(r2),  r3
		 j	 endif_2
		 else_2 nop
		 addi	 r3, r0, 5
		 sw	 -40(r2),  r3
		 lw	 r3, -40(r2)
		 sw	 -4(r2),  r3
		 endif_2 nop
		 j	 endif_1
		 else_1 nop
		 addi	 r3, r0, 3
		 sw	 -44(r2),  r3
		 lw	 r3, -44(r2)
		 sw	 -4(r2),  r3
		 endif_1 nop
		 lw	 r3, -4(r2)
		 sw	 -8(r14), r3
		 addi	 r4,r0,buf
		 sw	 -12(r14), r4
		 jl	 r15, intstr
		 sw	 -8(r14), r13
		 jl	 r15, putstr
		 addi	 r2, r0, topaddr  % Set stack pointer
		 hlt
buf	res	20
