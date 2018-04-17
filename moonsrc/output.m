a		 % Function Definition
		 sw	 -64(r14), r15	 % Save Link
		 addi	 r3, r0, 5
		 sw	 -8(r14),  r3
		 addi	 r3, r0, 2
		 sw	 -12(r14),  r3
		 lw	 r3, -8(r14)
		 lw	 r4, -12(r14)
		 add	 r5,r3,r4
		 sw	 -16(r14), r5
		 addi	 r3, r0, 3
		 sw	 -20(r14),  r3
		 lw	 r3, -16(r14)
		 lw	 r4, -20(r14)
		 sub	 r5,r3,r4
		 sw	 -24(r14), r5
		 addi	 r3, r0, 4
		 sw	 -28(r14),  r3
		 addi	 r3, r0, 2
		 sw	 -32(r14),  r3
		 lw	 r3, -28(r14)
		 lw	 r4, -32(r14)
		 div	 r5,r3,r4
		 sw	 -36(r14), r5
		 addi	 r3, r0, 3
		 sw	 -40(r14),  r3
		 lw	 r3, -40(r14)
		 muli	 r4,r3,-1
		 sw	 -44(r14), r4
		 lw	 r3, -36(r14)
		 lw	 r4, -44(r14)
		 mul	 r5,r3,r4
		 sw	 -48(r14), r5
		 lw	 r3, -24(r14)
		 lw	 r4, -48(r14)
		 add	 r5,r3,r4
		 sw	 -52(r14), r5
		 addi	 r3, r0, 5
		 sw	 -56(r14),  r3
		 lw	 r3, -52(r14)
		 lw	 r4, -56(r14)
		 add	 r5,r3,r4
		 sw	 -60(r14), r5
		 lw	 r3, -60(r14)
		 sw	 -4(r14),  r3
		 lw	 r13, -4(r14)
		 lw	 r15, -64(r14)	 % Restore Link
		 jr r15
entry % Program start
		 addi	 r14, r0, topaddr  % Set stack pointer
		 addi	 r3, r0, 10.2
		 sw	 -12(r14),  r3
		 lw	 r3, -12(r14)
		 sw	 -8(r14),  r3
		 addi	 r3, r0, 5
		 sw	 -16(r14),  r3
		 addi	 r3, r0, 5
		 sw	 -20(r14),  r3
		 lw	 r3, -20(r14)
		 lw	 r4, -8(r14)
		 mul	 r5,r3,r4
		 sw	 -24(r14), r5
		 lw	 r3, -16(r14)
		 lw	 r4, -24(r14)
		 add	 r5,r3,r4
		 sw	 -28(r14), r5
		 lw	 r3, -28(r14)
		 sw	 -4(r14),  r3
		 addi	 r3, r0, 15
		 sw	 -32(r14),  r3
		 lw	 r3, -32(r14)
		 sw	 undefined(r14),  r3
		 lw	 r3, -4(r14)
		 sw	 -40(r14), r3
		 addi	 r4,r0,buf
		 sw	 -44(r14), r4
		 subi	 r14, r14, 32	 % Adjust SP
		 jl	 r15, intstr
		 addi	 r14, r14, 32	 % Adjust SP
		 sw	 -40(r14), r13
		 subi	 r14, r14, 32	 % Adjust SP
		 jl	 r15, putstr
		 addi	 r14, r14, 32	 % Adjust SP
		 addi	 r5, r0, m2	 % CR
		 sw	 -40(r14), r5
		 subi	 r14, r14, 32	 % Adjust SP
		 jl	 r15, putstr
		 addi	 r14, r14, 32	 % Adjust SP
		 hlt
buf	res	20
m2	db	 13,10,0
