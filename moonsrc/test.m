entry %
align %
addi  r1, r0, topaddr  %
addi  r2, r0, topaddr  %
addi r14, r0, topaddr
subi  r1, r1, 12 %
addi r3, r0, 2 %
sw -12(r2), r3 %
addi r8, r0, 34 %
sw -8(r2), r8 %
lw r6, -12(r2) %
lw r9, -8(r2) %
lw r11, -12(r2) %
mul r9, r9, r11 %
add r6, r6, r9 %
sw -4(r2), r6 %
lw r10, -4(r2) %
sw -8(r14), r10 %
addi   r1,r10,buf
sw     -12(r14),r1
jl r15, intstr %
sw  -8(r14),r10
jl  r15,putstr
hlt %
