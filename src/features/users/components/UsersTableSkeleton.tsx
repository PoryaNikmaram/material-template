import { TableContainer, Table, TableHead, TableRow, TableCell, Box, Skeleton, TableBody } from '@mui/material'

const SKELETON_ROWS = 5

export const UsersTableSkeleton = ({ tableStyles }: { tableStyles: string }) => (
  <TableContainer>
    <Table className={tableStyles}>
      <TableHead>
        <TableRow>
          {['کاربر', 'نام کاربری', 'ایمیل', 'نقش', 'وضعیت', 'عملیات'].map(header => (
            <TableCell key={header}>{header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell>
              <Box className='flex items-center gap-3'>
                <Skeleton variant='circular' width={34} height={34} animation='wave' />
                <Skeleton width={120} animation='wave' />
              </Box>
            </TableCell>
            <TableCell>
              <Skeleton width={100} />
            </TableCell>
            <TableCell>
              <Skeleton width={160} />
            </TableCell>
            <TableCell>
              <Skeleton width={80} />
            </TableCell>
            <TableCell>
              <Skeleton width={64} height={24} />
            </TableCell>
            <TableCell>
              <Skeleton variant='circular' width={32} height={32} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
)
